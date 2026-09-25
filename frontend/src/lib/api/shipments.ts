/**
 * Shipments API service.
 *
 * Wraps the actual backend endpoints:
 *   POST  /api/shipments            — create a new shipment linked to a transfer
 *   GET   /api/shipments            — list all shipments (includes transfer)
 *   PATCH /api/shipments/:id/status — update shipment status
 *
 * No authentication middleware is applied to these routes in the current backend.
 *
 * NOTE — Backend PATCH /api/shipments/:id/status is defined TWICE in the route file
 *   (apparent duplication bug). Only the SECOND handler actually updates the Transfer
 *   status. This is a backend issue — report to backend team but do NOT fix.
 *
 * Shipment status values (from Prisma schema):
 *   "PENDING" | "DISPATCHED" | "DELIVERED"
 *   When status = "DISPATCHED": dispatchedAt is set
 *   When status = "DELIVERED":  deliveredAt is set
 *   When status = "DISPATCHED": linked Transfer status becomes "IN_TRANSIT"
 *
 * MISSING BACKEND APIs:
 *   - No GET /api/shipments/:id (single shipment)
 *   - No filtering/pagination on GET /api/shipments
 *   - No DELETE /api/shipments/:id
 */

import { apiClient } from './client';

export interface ShipmentTransfer {
  id: string;
  fromPhcId: string;
  toPhcId: string;
  medicineId: string;
  quantity: number;
  status: string;
  requestedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendShipment {
  id: string;
  transferId: string;
  status: string;         // "PENDING" | "DISPATCHED" | "DELIVERED"
  trackingNo: string | null;
  dispatchedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
  transfer: ShipmentTransfer;
}

export interface CreateShipmentPayload {
  transferId: string;
  trackingNo?: string;
}

export interface UpdateShipmentStatusPayload {
  status: 'PENDING' | 'DISPATCHED' | 'DELIVERED';
}

/**
 * GET /api/shipments
 * Returns all shipments ordered by newest first, with transfer details.
 */
export async function getShipments(): Promise<BackendShipment[]> {
  return apiClient.get<BackendShipment[]>('/api/shipments');
}

/**
 * POST /api/shipments
 * Creates a new shipment for an existing transfer.
 */
export async function createShipment(payload: CreateShipmentPayload): Promise<BackendShipment> {
  return apiClient.post<BackendShipment>('/api/shipments', payload);
}

/**
 * PATCH /api/shipments/:id/status
 * Updates shipment status. Also updates the linked Transfer status:
 *   DISPATCHED -> Transfer becomes "IN_TRANSIT"
 *   DELIVERED  -> Transfer becomes "DELIVERED"
 */
export async function updateShipmentStatus(
  id: string,
  payload: UpdateShipmentStatusPayload
): Promise<BackendShipment> {
  return apiClient.patch<BackendShipment>(`/api/shipments/${id}/status`, payload);
}
