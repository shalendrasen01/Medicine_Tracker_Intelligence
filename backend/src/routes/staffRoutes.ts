import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { authorizePhcAccess } from "../middleware/resourceAccess";
import { validate } from "../middleware/validate";
import { staffSchema } from "../validators/schemas";

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
    const staff = await prisma.staff.findMany({
      where: { phcId },
      orderBy: { createdAt: "desc" },
    });

    res.json(staff);
  }
);

router.post(
  "/",
  authenticate,
  validate(staffSchema),
  authorize(
    "CENTRAL_ADMIN",
    "STATE_ADMIN",
    "PHC_ADMIN"
  ),
  authorizePhcAccess("body", "phcId"),
  async (req, res) => {
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
  }
);

export default router;