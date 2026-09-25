import { prisma } from "../config/database";

export interface CreateAuditLogParams {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: Record<string, unknown> | string | null;
}

export async function logAudit({
  userId,
  action,
  entity,
  entityId,
  details,
}: CreateAuditLogParams): Promise<void> {
  try {
    let sanitizedDetails: string | null = null;

    if (typeof details === "object" && details !== null) {
      // Create a clean copy and strip any sensitive fields
      const cleanDetails = { ...details };
      delete (cleanDetails as any).password;
      delete (cleanDetails as any).passwordHash;
      delete (cleanDetails as any).token;
      delete (cleanDetails as any).jwt;
      delete (cleanDetails as any).secret;
      sanitizedDetails = JSON.stringify(cleanDetails);
    } else if (typeof details === "string") {
      sanitizedDetails = details;
    }

    await prisma.auditLog.create({
      data: {
        userId: userId ?? null,
        action,
        entity,
        entityId: entityId ?? null,
        details: sanitizedDetails,
      },
    });
  } catch (error) {
    console.error("[AuditService] Failed to create audit log:", error);
  }
}
