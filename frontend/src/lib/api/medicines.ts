/**
 * Medicines API service.
 *
 * Wraps the actual backend endpoints:
 *   GET  /api/medicines   — list all medicines
 *   POST /api/medicines   — create a new medicine
 *
 * No authentication middleware is applied to these routes in the current backend.
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

export interface CreateMedicinePayload {
  name: string;
  category?: string;
  unit: string;
}

/**
 * GET /api/medicines
 * Returns all medicines in the system.
 */
export async function getMedicines(): Promise<Medicine[]> {
  return apiClient.get<Medicine[]>('/api/medicines');
}

/**
 * POST /api/medicines
 * Creates a new medicine entry.
 */
export async function createMedicine(payload: CreateMedicinePayload): Promise<Medicine> {
  return apiClient.post<Medicine>('/api/medicines', payload);
}
