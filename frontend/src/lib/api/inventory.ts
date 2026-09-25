/**
 * Inventory API service.
 *
 * Wraps the actual backend endpoints:
 *   GET  /api/inventory/:phcId   — get inventory for a PHC (includes medicine)
 *   POST /api/inventory           — create or update an inventory record
 *
 * No authentication middleware is applied to these routes in the current backend.
 *
 * NOTE — MISSING BACKEND API:
 *   There is no GET /api/inventory (all PHCs) endpoint.
 *   The frontend inventory page shows a cross-PHC view which cannot be served
 *   by the current backend without PHC-specific queries.
 *   The frontend will keep its existing static data for the overview table.
 *   The backend team should add: GET /api/inventory (admin view, all PHCs).
 */

import { apiClient } from './client';

export interface Medicine {
  id: string;
  name: string;
  category: string | null;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryRecord {
  id: string;
  phcId: string;
  medicineId: string;
  quantity: number;
  minStock: number;
  updatedAt: string;
  medicine: Medicine;
}

export interface UpsertInventoryPayload {
  phcId: string;
  medicineId: string;
  quantity: number;
  minStock: number;
}

/**
 * GET /api/inventory/:phcId
 * Returns all inventory records for the given PHC, including medicine details.
 */
export async function getInventoryByPhc(phcId: string): Promise<InventoryRecord[]> {
  return apiClient.get<InventoryRecord[]>(`/api/inventory/${phcId}`);
}

/**
 * POST /api/inventory
 * Creates or updates (upsert) an inventory record for a medicine at a PHC.
 * Also auto-creates a LOW_STOCK alert if quantity < minStock.
 */
export async function upsertInventory(payload: UpsertInventoryPayload): Promise<InventoryRecord> {
  return apiClient.post<InventoryRecord>('/api/inventory', payload);
}
