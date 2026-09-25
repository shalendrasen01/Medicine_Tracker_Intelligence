import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { authorizePhcAccess } from "../middleware/resourceAccess";
import { validate } from "../middleware/validate";
import { inventorySchema } from "../validators/schemas";
import {
  emitAlertCreated,
  emitInventoryUpdated,
} from "../sockets/socket";
import { logAudit } from "../services/auditService";
import { AuthUser } from "../middleware/auth";

const router = Router();

router.get(
  "/:phcId",
  authenticate,
  authorize("CENTRAL_ADMIN", "STATE_ADMIN", "PHC_ADMIN"),
  authorizePhcAccess("params", "phcId"),
  async (req, res) => {
    const phcId = Array.isArray(req.params.phcId)
      ? req.params.phcId[0]
      : req.params.phcId;
    const inventory = await prisma.inventory.findMany({
      where: { phcId },
      include: {
        medicine: true,
      },
    });

    res.json(inventory);
  }
);

router.post(
  "/",
  authenticate,
  validate(inventorySchema),
  authorize("CENTRAL_ADMIN", "STATE_ADMIN", "PHC_ADMIN"),
  authorizePhcAccess("body", "phcId"),
  async (req, res) => {
    const { phcId, medicineId, quantity, minStock } = req.body;

    const inventory = await prisma.inventory.upsert({
      where: {
        phcId_medicineId: {
          phcId,
          medicineId,
        },
      },
      update: {
        quantity,
        minStock,
      },
      create: {
        phcId,
        medicineId,
        quantity,
        minStock,
      },
    });

    emitInventoryUpdated(inventory);

    const user = (req as any).user as AuthUser;
    await logAudit({
      userId: user.userId,
      action: "UPDATE_INVENTORY",
      entity: "Inventory",
      entityId: inventory.id,
      details: {
        phcId,
        medicineId,
        quantity,
        minStock,
      },
    });

    if (inventory.quantity < inventory.minStock) {
      const alert = await prisma.alert.create({
        data: {
          phcId,
          medicineId,
          type: "LOW_STOCK",
          message: "Low stock for medicine",
        },
      });

      emitAlertCreated(alert);
    }

    res.status(201).json(inventory);
  }
);

export default router;