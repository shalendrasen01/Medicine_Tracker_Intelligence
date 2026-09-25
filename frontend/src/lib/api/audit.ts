/**
 * Audit Logs API service.
 *
 * Wraps the actual backend endpoints:
 *   GET  /api/audit   — list all audit log entries (ordered by createdAt desc)
 *   POST /api/audit   — create an audit log entry
 *
 * No authentication middleware on these routes.
 *
 * MISSING BACKEND APIs:
 *   - No filtering by userId, entity, or date range
 *   - No pagination support
 */

import { apiClient } from './client';

export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: string;
}

export interface CreateAuditLogPayload {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
}

/**
 * GET /api/audit
 * Returns all audit log entries ordered by newest first.
 */
export async function getAuditLogs(): Promise<AuditLog[]> {
  return apiClient.get<AuditLog[]>('/api/audit');
}

/**
 * POST /api/audit
 * Creates a new audit log entry.
 */
export async function createAuditLog(payload: CreateAuditLogPayload): Promise<AuditLog> {
  return apiClient.post<AuditLog>('/api/audit', payload);
}
