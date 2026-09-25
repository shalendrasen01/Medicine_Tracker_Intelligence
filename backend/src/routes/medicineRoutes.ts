import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.get("/", async (_req, res) => {
  const medicines = await prisma.medicine.findMany();

  res.json(medicines);
});

router.post("/", async (req, res) => {
  const { name, category, unit } = req.body;

  const medicine = await prisma.medicine.create({
    data: { name, category, unit },
  });

  res.status(201).json(medicine);
});

export default router;