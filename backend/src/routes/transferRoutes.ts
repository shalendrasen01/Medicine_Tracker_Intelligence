import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.post("/", async (req, res) => {
  const {
    fromPhcId,
    toPhcId,
    medicineId,
    quantity,
    requestedById,
  } = req.body;

  const transfer = await prisma.transfer.create({
    data: {
      fromPhcId,
      toPhcId,
      medicineId,
      quantity,
      requestedById,
    },
  });

  res.status(201).json(transfer);
});

router.get("/", async (_req, res) => {
  const transfers = await prisma.transfer.findMany({
    include: {
      medicine: true,
      requestedBy: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(transfers);
});

export default router;