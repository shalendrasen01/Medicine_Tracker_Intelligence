import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { authorizePhcAccess } from "../middleware/resourceAccess";
import { validate } from "../middleware/validate";
import { patientDataSchema } from "../validators/schemas";

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
    const data = await prisma.patientData.findMany({
      where: { phcId },
      orderBy: { date: "desc" },
    });

    res.json(data);
  }
);

router.post(
  "/",
  authenticate,
  validate(patientDataSchema),
  authorize(
    "CENTRAL_ADMIN",
    "STATE_ADMIN",
    "PHC_ADMIN"
  ),
  authorizePhcAccess("body", "phcId"),
  async (req, res) => {
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
  }
);

export default router;