import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { AuthUser } from "./auth";

export interface UserScope {
  userId: string;
  role: string;
  stateId: string | null;
  phcId: string | null;
}

export async function getUserScope(user: AuthUser): Promise<UserScope> {
  if (user.stateId !== undefined && user.phcId !== undefined) {
    return {
      userId: user.userId,
      role: user.role,
      stateId: user.stateId ?? null,
      phcId: user.phcId ?? null,
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { stateId: true, phcId: true },
  });

  return {
    userId: user.userId,
    role: user.role,
    stateId: dbUser?.stateId ?? null,
    phcId: dbUser?.phcId ?? null,
  };
}

export async function canAccessPhc(
  user: AuthUser,
  targetPhcId: string
): Promise<boolean> {
  if (user.role === "CENTRAL_ADMIN") {
    return true;
  }

  const scope = await getUserScope(user);

  if (scope.role === "PHC_ADMIN") {
    return scope.phcId === targetPhcId;
  }

  if (scope.role === "STATE_ADMIN") {
    if (scope.stateId === null || scope.stateId === undefined) return false;

    const phc = await prisma.pHC.findUnique({
      where: { id: targetPhcId },
      include: { district: true },
    });

    return phc?.district?.stateId === scope.stateId;
  }

  return false;
}

export async function getAccessiblePhcIds(
  user: AuthUser
): Promise<string[] | "ALL"> {
  if (user.role === "CENTRAL_ADMIN" || user.role === "LOGISTICS_COORDINATOR") {
    return "ALL";
  }

  const scope = await getUserScope(user);

  if (scope.role === "PHC_ADMIN") {
    return scope.phcId ? [scope.phcId] : [];
  }

  if (scope.role === "STATE_ADMIN") {
    if (scope.stateId === null || scope.stateId === undefined) return [];

    const phcs = await prisma.pHC.findMany({
      where: {
        district: {
          stateId: scope.stateId,
        },
      },
      select: { id: true },
    });

    return phcs.map((p) => p.id);
  }

  return [];
}

export const authorizePhcAccess = (
  source: "params" | "body" = "params",
  paramName: string = "phcId"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as AuthUser | undefined;

    if (!user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (user.role === "CENTRAL_ADMIN") {
      return next();
    }

    const rawValue =
      source === "params" ? req.params[paramName] : req.body[paramName];
    const targetPhcId = Array.isArray(rawValue) ? rawValue[0] : rawValue;

    if (!targetPhcId) {
      return res.status(400).json({
        message: `${paramName} is required for authorization`,
      });
    }

    try {
      const allowed = await canAccessPhc(user, targetPhcId);
      if (!allowed) {
        return res.status(403).json({
          message: "Access denied: unauthorized for this PHC",
        });
      }
      next();
    } catch {
      return res.status(500).json({
        message: "Failed to authorize resource access",
      });
    }
  };
};
