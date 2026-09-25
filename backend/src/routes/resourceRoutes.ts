import { Router } from "express";
import { prisma } from "../config/database";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import {
  authorizePhcAccess,
  getAccessiblePhcIds,
} from "../middleware/resourceAccess";
import { AuthUser } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { resourceRequestSchema } from "../validators/schemas";
import { logAudit } from "../services/auditService";

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

    const requests = await prisma.resourceRequest.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(requests);
  }
);

router.post(
  "/",
  authenticate,
  validate(resourceRequestSchema),
  authorize(
    "CENTRAL_ADMIN",
    "STATE_ADMIN",
    "PHC_ADMIN"
  ),
  authorizePhcAccess("body", "phcId"),
  async (req, res) => {
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
        requestedBy: requestedBy || ((req as any).user as AuthUser).userId,
      },
    });

    const user = (req as any).user as AuthUser;
    await logAudit({
      userId: user.userId,
      action: "CREATE_RESOURCE_REQUEST",
      entity: "ResourceRequest",
      entityId: request.id,
      details: {
        phcId,
        resource,
        quantity,
        priority,
      },
    });

    res.status(201).json(request);
  }
);

export default router;