import { Router } from "express";
import { medicineQueue } from "../jobs/queue";

const router = Router();

router.post("/test", async (_req, res) => {
  const job = await medicineQueue.add("test-job", {
    message: "BullMQ API job working",
  });

  res.json({
    message: "Job added",
    jobId: job.id,
  });
});

router.post("/low-stock", async (_req, res) => {
  const job = await medicineQueue.add("low-stock-check", {
    message: "Check medicines for low stock",
  });

  res.json({
    message: "Low-stock job added",
    jobId: job.id,
  });
});

export default router;