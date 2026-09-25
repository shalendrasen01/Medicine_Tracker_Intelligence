import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.get("/", async (_req, res) => {
  const requests = await prisma.resourceRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(requests);
});

router.post("/", async (req, res) => {
  const {
    phcId,
    resource,
    quantity,
    priority,
    requestedBy,
  } = req.body;

  const request = await prisma.resourceRequest.create({
    data: {
      phcId,
      resource,
      quantity,
      priority,
      requestedBy,
    },
  });

  res.status(201).json(request);
});

export default router;