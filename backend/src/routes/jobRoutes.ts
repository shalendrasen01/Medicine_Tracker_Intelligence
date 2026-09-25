import { Router } from "express";
import { medicineQueue } from "../jobs/queue";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { lowStockJobSchema, testJobSchema } from "../validators/schemas";

const router = Router();

router.post(
  "/test",
  authenticate,
  authorize("CENTRAL_ADMIN"),
  validate(testJobSchema),
  async (req, res) => {
    const job = await medicineQueue.add("test-job", {
      message: req.body?.message || "BullMQ API job working",
    });

    res.json({
      message: "Job added",
      jobId: job.id,
    });
  }
);

router.post(
  "/low-stock",
  authenticate,
  authorize("CENTRAL_ADMIN", "STATE_ADMIN"),
  validate(lowStockJobSchema),
  async (req, res) => {
    const job = await medicineQueue.add("low-stock-check", {
      message: req.body?.message || "Check medicines for low stock",
      phcId: req.body?.phcId,
      threshold: req.body?.threshold,
    });

    res.json({
      message: "Low-stock job added",
      jobId: job.id,
    });
  }
);

export default router;