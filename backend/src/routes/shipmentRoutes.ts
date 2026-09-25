import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import {
  canAccessPhc,
  getAccessiblePhcIds,
} from "../middleware/resourceAccess";
import { AuthUser } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  shipmentSchema,
  shipmentStatusSchema,
} from "../validators/schemas";
import {
  emitShipmentUpdated,
  emitTransferUpdated,
} from "../sockets/socket";
import { logAudit } from "../services/auditService";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(shipmentSchema),
  authorize("CENTRAL_ADMIN", "STATE_ADMIN", "LOGISTICS_COORDINATOR"),
  async (req, res) => {
    const { transferId, trackingNo } = req.body;
    const user = (req as any).user as AuthUser;

    if (user.role === "STATE_ADMIN") {
      const transfer = await prisma.transfer.findUnique({
        where: { id: transferId },
      });

      if (!transfer) {
        return res.status(404).json({ message: "Transfer not found" });
      }

      const allowed = await canAccessPhc(user, transfer.fromPhcId);
      if (!allowed) {
        return res.status(403).json({
          message: "Access denied: transfer belongs to another state",
        });
      }
    }

    const shipment = await prisma.shipment.create({
      data: {
        transferId,
        trackingNo,
      },
    });

    emitShipmentUpdated(shipment);

    await logAudit({
      userId: user.userId,
      action: "CREATE_SHIPMENT",
      entity: "Shipment",
      entityId: shipment.id,
      details: {
        transferId: shipment.transferId,
        trackingNo: shipment.trackingNo,
      },
    });

    res.status(201).json(shipment);
  }
);

router.get(
  "/",
  authenticate,
  authorize(
    "CENTRAL_ADMIN",
    "STATE_ADMIN",
    "PHC_ADMIN",
    "LOGISTICS_COORDINATOR"
  ),
  async (req, res) => {
    const user = (req as any).user as AuthUser;
    const accessiblePhcs = await getAccessiblePhcIds(user);

    const whereClause =
      accessiblePhcs === "ALL"
        ? {}
        : {
            transfer: {
              OR: [
                { fromPhcId: { in: accessiblePhcs } },
                { toPhcId: { in: accessiblePhcs } },
              ],
            },
          };

    const shipments = await prisma.shipment.findMany({
      where: whereClause,
      include: {
        transfer: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(shipments);
  }
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("CENTRAL_ADMIN", "LOGISTICS_COORDINATOR"),
  validate(shipmentStatusSchema),
  async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;

    const shipment = await prisma.shipment.update({
      where: { id },
      data: {
        status,
        ...(status === "DISPATCHED" && {
          dispatchedAt: new Date(),
        }),
        ...(status === "DELIVERED" && {
          deliveredAt: new Date(),
        }),
      },
    });

    const updatedTransfer = await prisma.transfer.update({
      where: { id: shipment.transferId },
      data: {
        status: status === "DISPATCHED" ? "IN_TRANSIT" : status,
      },
    });

    emitShipmentUpdated(shipment);
    emitTransferUpdated(updatedTransfer);

    const user = (req as any).user as AuthUser;
    await logAudit({
      userId: user.userId,
      action: "UPDATE_SHIPMENT_STATUS",
      entity: "Shipment",
      entityId: shipment.id,
      details: {
        status: shipment.status,
        transferId: shipment.transferId,
      },
    });

    res.json(shipment);
  }
);

export default router;