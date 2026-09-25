import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import {
  canAccessPhc,
  getAccessiblePhcIds,
} from "../middleware/resourceAccess";
import { AuthUser } from "../middleware/auth";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize(
    "CENTRAL_ADMIN",
    "STATE_ADMIN",
    "PHC_ADMIN",
    "LOGISTICS_COORDINATOR"
  ),
  async (req, res) => {
    const user = (req as any).user as AuthUser;
    const accessiblePhcs = await getAccessiblePhcIds(user);

    const whereClause =
      accessiblePhcs === "ALL"
        ? {}
        : {
            phcId: {
              in: accessiblePhcs,
            },
          };

    const alerts = await prisma.alert.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(alerts);
  }
);

router.patch(
  "/:id/read",
  authenticate,
  authorize(
    "CENTRAL_ADMIN",
    "STATE_ADMIN",
    "PHC_ADMIN",
    "LOGISTICS_COORDINATOR"
  ),
  async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = (req as any).user as AuthUser;

    const existingAlert = await prisma.alert.findUnique({
      where: { id },
    });

    if (!existingAlert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    if (
      user.role !== "CENTRAL_ADMIN" &&
      user.role !== "LOGISTICS_COORDINATOR"
    ) {
      const allowed = await canAccessPhc(user, existingAlert.phcId);
      if (!allowed) {
        return res.status(403).json({
          message: "Access denied for this alert",
        });
      }
    }

    const alert = await prisma.alert.update({
      where: { id },
      data: {
        isRead: true,
      },
    });

    res.json(alert);
  }
);

export default router;