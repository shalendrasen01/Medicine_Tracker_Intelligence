import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.get("/:phcId", async (req, res) => {
  const staff = await prisma.staff.findMany({
    where: { phcId: req.params.phcId },
    orderBy: { createdAt: "desc" },
  });

  res.json(staff);
});

router.post("/", async (req, res) => {
  const { phcId, name, role, count } = req.body;

  const staff = await prisma.staff.create({
    data: {
      phcId,
      name,
      role,
      count,
    },
  });

  res.status(201).json(staff);
});

export default router;