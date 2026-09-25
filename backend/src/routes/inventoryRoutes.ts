import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.get("/:phcId", async (req, res) => {
  const inventory = await prisma.inventory.findMany({
    where: { phcId: req.params.phcId },
    include: {
      medicine: true,
    },
  });

  res.json(inventory);
});

router.post("/", async (req, res) => {
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

  if (inventory.quantity < inventory.minStock) {
    await prisma.alert.create({
      data: {
        phcId,
        medicineId,
        type: "LOW_STOCK",
        message: `Low stock for medicine`,
      },
    });
  }

  res.status(201).json(inventory);
});

export default router;
