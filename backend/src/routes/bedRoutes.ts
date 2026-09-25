import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.get("/:phcId", async (req, res) => {
  const bed = await prisma.bed.findUnique({
    where: { phcId: req.params.phcId },
  });

  res.json(bed);
});

router.post("/", async (req, res) => {
  const { phcId, totalBeds, occupied } = req.body;

  const bed = await prisma.bed.upsert({
    where: { phcId },
    update: {
      totalBeds,
      occupied,
    },
    create: {
      phcId,
      totalBeds,
      occupied,
    },
  });

  res.status(201).json(bed);
});

export default router;