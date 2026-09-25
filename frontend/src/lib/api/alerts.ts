/**
 * Alerts API service.
 *
 * Wraps the actual backend endpoints:
 *   GET   /api/alerts          — list all alerts (ordered by createdAt desc)
 *   PATCH /api/alerts/:id/read — mark an alert as read (isRead: true)
 *
 * No authentication middleware is applied to these routes in the current backend.
 *
 * NOTE — BACKEND ALERT STRUCTURE vs FRONTEND:
 *   The backend Alert model fields: id, phcId, medicineId, type, message, isRead, createdAt
 *   The backend creates alerts automatically when inventory drops below minStock (type: "LOW_STOCK").
 *   The backend does NOT support severity, category, assignedTo, or district fields.
 *   The frontend AlertsMonitoringPage uses an extended local interface — this service
 *   returns the actual backend data; mapping/enrichment is left to the consuming component.
 *
 * NOTE — MISSING BACKEND APIs:
 *   - No POST /api/alerts (manual alert creation not supported from frontend)
 *   - No DELETE /api/alerts/:id
 *   - No PUT/PATCH /api/alerts/:id/status (only isRead is supported, not severity/category)
 *   - No filtering/pagination query params on GET /api/alerts
 *   These should be added by the backend team if needed.
 */

import { apiClient } from './client';

export interface BackendAlert {
  id: string;
  phcId: string;
  medicineId: string;
  type: string;          // e.g. "LOW_STOCK"
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * GET /api/alerts
 * Returns all alerts ordered by newest first.
 */
export async function getAlerts(): Promise<BackendAlert[]> {
  return apiClient.get<BackendAlert[]>('/api/alerts');
}

/**
 * PATCH /api/alerts/:id/read
 * Marks the specified alert as read. Returns the updated alert.
 */
export async function markAlertRead(id: string): Promise<BackendAlert> {
  return apiClient.patch<BackendAlert>(`/api/alerts/${id}/read`, {});
}
