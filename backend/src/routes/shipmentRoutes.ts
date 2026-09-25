import { Router } from "express";
import { prisma } from "../config/database";

const router = Router();

router.post("/", async (req, res) => {
  const { transferId, trackingNo } = req.body;

  const shipment = await prisma.shipment.create({
    data: {
      transferId,
      trackingNo,
    },
  });

  res.status(201).json(shipment);
});

router.get("/", async (_req, res) => {
  const shipments = await prisma.shipment.findMany({
    include: {
      transfer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(shipments);
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  const shipment = await prisma.shipment.update({
    where: { id: req.params.id },
    data: {
      status,
      ...(status === "DISPATCHED" && { dispatchedAt: new Date() }),
      ...(status === "DELIVERED" && { deliveredAt: new Date() }),
    },
  });

  res.json(shipment);
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  const shipment = await prisma.shipment.update({
    where: { id: req.params.id },
    data: {
      status,
      ...(status === "DISPATCHED" && { dispatchedAt: new Date() }),
      ...(status === "DELIVERED" && { deliveredAt: new Date() }),
    },
  });

  await prisma.transfer.update({
    where: { id: shipment.transferId },
    data: {
      status: status === "DISPATCHED" ? "IN_TRANSIT" : status,
    },
  });

  res.json(shipment);
});

export default router;