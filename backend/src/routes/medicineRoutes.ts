import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { medicineSchema } from "../validators/schemas";
import { logAudit } from "../services/auditService";
import { AuthUser } from "../middleware/auth";

const router = Router();


router.get(
  "/",
  authenticate,
  authorize("CENTRAL_ADMIN", "STATE_ADMIN", "PHC_ADMIN"),
  async (_req, res) => {
    const medicines = await prisma.medicine.findMany();
    res.json(medicines);
  }
);

router.post(
  "/",
  authenticate,
  authorize("CENTRAL_ADMIN"),
  validate(medicineSchema),
  async (req, res) => {
    const { name, category, unit } = req.body;
    const user = (req as any).user as AuthUser;

    const medicine = await prisma.medicine.create({
      data: { name, category, unit },
    });

    await logAudit({
      userId: user.userId,
      action: "CREATE_MEDICINE",
      entity: "Medicine",
      entityId: medicine.id,
      details: { name, category, unit },
    });

    res.status(201).json(medicine);
  }
);

export default router;