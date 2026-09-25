import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.get("/", async (_req, res) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(logs);
});

router.post("/", async (req, res) => {
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
});

export default router;