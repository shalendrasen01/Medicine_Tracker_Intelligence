/**
 * Transfers API service.
 *
 * Wraps the actual backend endpoints:
 *   POST /api/transfers   — create a new transfer request
 *   GET  /api/transfers   — list all transfers (includes medicine and requestedBy user)
 *
 * No authentication middleware is applied to these routes in the current backend.
 *
 * NOTE — MISSING BACKEND APIs:
 *   - No PATCH /api/transfers/:id/status (transfer status updates not exposed)
 *   - No GET /api/transfers/:id (single transfer fetch)
 *   - No filtering/pagination on GET /api/transfers
 *   The backend team should add status update and single-fetch endpoints.
 *
 * Backend Transfer status values (from Prisma schema default + shipment updates):
 *   "PENDING" | "IN_TRANSIT" | "DISPATCHED" | "DELIVERED"
 */

import { apiClient } from './client';

export interface TransferMedicine {
  id: string;
  name: string;
  category: string | null;
  unit: string;
}

export interface TransferUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface BackendTransfer {
  id: string;
  fromPhcId: string;
  toPhcId: string;
  medicineId: string;
  quantity: number;
  status: string;       // "PENDING" | "IN_TRANSIT" | "DISPATCHED" | "DELIVERED"
  requestedById: string;
  createdAt: string;
  updatedAt: string;
  medicine: TransferMedicine;
  requestedBy: TransferUser;
}

export interface CreateTransferPayload {
  fromPhcId: string;
  toPhcId: string;
  medicineId: string;
  quantity: number;
  requestedById: string;
}

/**
 * GET /api/transfers
 * Returns all transfers ordered by newest first, with medicine and requester info.
 */
export async function getTransfers(): Promise<BackendTransfer[]> {
  return apiClient.get<BackendTransfer[]>('/api/transfers');
}

/**
 * POST /api/transfers
 * Creates a new transfer request. Initial status is "PENDING".
 */
export async function createTransfer(payload: CreateTransferPayload): Promise<BackendTransfer> {
  return apiClient.post<BackendTransfer>('/api/transfers', payload);
}
