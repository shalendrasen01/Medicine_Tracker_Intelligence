import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { authorizePhcAccess } from "../middleware/resourceAccess";
import { validate } from "../middleware/validate";
import { bedSchema } from "../validators/schemas";

const router = Router();

router.get(
  "/:phcId",
  authenticate,
  authorize(
    "CENTRAL_ADMIN",
    "STATE_ADMIN",
    "PHC_ADMIN"
  ),
  authorizePhcAccess("params", "phcId"),
  async (req, res) => {
    const phcId = Array.isArray(req.params.phcId)
      ? req.params.phcId[0]
      : req.params.phcId;

    if (!phcId) {
      return res.status(400).json({
        message: "PHC ID is required",
      });
    }

    const bed = await prisma.bed.findUnique({
      where: { phcId },
    });

    res.json(bed);
  }
);

router.post(
  "/",
  authenticate,
  validate(bedSchema),
  authorize(
    "CENTRAL_ADMIN",
    "STATE_ADMIN",
    "PHC_ADMIN"
  ),
  authorizePhcAccess("body", "phcId"),
  async (req, res) => {
    const { phcId, totalBeds, occupied } = req.body;

    if (!phcId) {
      return res.status(400).json({
        message: "PHC ID is required",
      });
    }

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
  }
);

export default router;