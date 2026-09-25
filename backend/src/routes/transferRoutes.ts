import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import {
  authorizePhcAccess,
  getAccessiblePhcIds,
} from "../middleware/resourceAccess";
import { AuthUser } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { transferSchema } from "../validators/schemas";
import { emitTransferCreated } from "../sockets/socket";
import { logAudit } from "../services/auditService";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(transferSchema),
  authorize("CENTRAL_ADMIN", "STATE_ADMIN", "PHC_ADMIN"),
  authorizePhcAccess("body", "fromPhcId"),
  async (req, res) => {
    const {
      fromPhcId,
      toPhcId,
      medicineId,
      quantity,
      requestedById,
    } = req.body;

    const user = (req as any).user as AuthUser;

    const transfer = await prisma.transfer.create({
      data: {
        fromPhcId,
        toPhcId,
        medicineId,
        quantity,
        requestedById: requestedById || user.userId,
      },
    });

    emitTransferCreated(transfer);

    await logAudit({
      userId: user.userId,
      action: "CREATE_TRANSFER",
      entity: "Transfer",
      entityId: transfer.id,
      details: {
        fromPhcId,
        toPhcId,
        medicineId,
        quantity,
      },
    });

    res.status(201).json(transfer);
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
            OR: [
              { fromPhcId: { in: accessiblePhcs } },
              { toPhcId: { in: accessiblePhcs } },
            ],
          };

    const transfers = await prisma.transfer.findMany({
      where: whereClause,
      include: {
        medicine: true,
        requestedBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(transfers);
  }
);

export default router;