import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.get("/:phcId", async (req, res) => {
  const data = await prisma.patientData.findMany({
    where: { phcId: req.params.phcId },
    orderBy: { date: "desc" },
  });

  res.json(data);
});

router.post("/", async (req, res) => {
  const { phcId, totalVisits, admissions, discharges } = req.body;

  const data = await prisma.patientData.create({
    data: {
      phcId,
      totalVisits,
      admissions,
      discharges,
    },
  });

  res.status(201).json(data);
});

export default router;