import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.get("/", async (_req, res) => {
  const alerts = await prisma.alert.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(alerts);
});

router.patch("/:id/read", async (req, res) => {
  const alert = await prisma.alert.update({
    where: { id: req.params.id },
    data: { isRead: true },
  });

  res.json(alert);
});

export default router;