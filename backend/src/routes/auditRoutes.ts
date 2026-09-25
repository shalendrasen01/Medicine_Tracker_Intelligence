import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { auditSchema } from "../validators/schemas";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("CENTRAL_ADMIN", "STATE_ADMIN"),
  async (_req, res) => {
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(logs);
  }
);

router.post(
  "/",
  authenticate,
  authorize("CENTRAL_ADMIN"),
  validate(auditSchema),
  async (req, res) => {
    const { userId, action, entity, entityId, details } = req.body;

    const log = await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
      },
    });

    res.status(201).json(log);
  }
);

export default router;