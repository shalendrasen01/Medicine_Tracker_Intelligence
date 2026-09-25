/**
 * PHC (Primary Health Centre) supporting APIs.
 *
 * These services wrap endpoints that provide PHC-level operational data:
 *
 *   Beds:
 *     GET  /api/beds/:phcId    — get bed occupancy for a PHC
 *     POST /api/beds           — create or update bed record
 *
 *   Patients:
 *     GET  /api/patients/:phcId  — list patient visit records for a PHC
 *     POST /api/patients          — create a patient data record
 *
 *   Staff:
 *     GET  /api/staff/:phcId   — list staff records for a PHC
 *     POST /api/staff           — create a staff record
 *
 *   Resources:
 *     GET  /api/resources       — list all resource requests
 *     POST /api/resources       — create a resource request
 *
 * No authentication middleware on any of these routes.
 *
 * MISSING BACKEND APIs:
 *   - No GET /api/phcs (no PHC listing endpoint — PHC IDs must be known ahead of time)
 *   - No GET /api/states or /api/districts (hierarchy not exposed via API)
 *   - No PATCH/PUT for beds, patients, or staff records
 *   - No PATCH /api/resources/:id/status (resource request status updates)
 *   The backend team should expose PHC/State/District listing endpoints.
 */

import { apiClient } from './client';

// ─── Beds ─────────────────────────────────────────────────────────────────────

export interface BedRecord {
  id: string;
  phcId: string;
  totalBeds: number;
  occupied: number;
  updatedAt: string;
}

export interface UpsertBedPayload {
  phcId: string;
  totalBeds: number;
  occupied: number;
}

export async function getBedsByPhc(phcId: string): Promise<BedRecord | null> {
  return apiClient.get<BedRecord | null>(`/api/beds/${phcId}`);
}

export async function upsertBeds(payload: UpsertBedPayload): Promise<BedRecord> {
  return apiClient.post<BedRecord>('/api/beds', payload);
}

// ─── Patient Data ─────────────────────────────────────────────────────────────

export interface PatientDataRecord {
  id: string;
  phcId: string;
  date: string;
  totalVisits: number;
  admissions: number;
  discharges: number;
}

export interface CreatePatientDataPayload {
  phcId: string;
  totalVisits: number;
  admissions: number;
  discharges: number;
}

export async function getPatientDataByPhc(phcId: string): Promise<PatientDataRecord[]> {
  return apiClient.get<PatientDataRecord[]>(`/api/patients/${phcId}`);
}

export async function createPatientData(
  payload: CreatePatientDataPayload
): Promise<PatientDataRecord> {
  return apiClient.post<PatientDataRecord>('/api/patients', payload);
}

// ─── Staff ────────────────────────────────────────────────────────────────────

export interface StaffRecord {
  id: string;
  phcId: string;
  name: string;
  role: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffPayload {
  phcId: string;
  name: string;
  role: string;
  count?: number;
}

export async function getStaffByPhc(phcId: string): Promise<StaffRecord[]> {
  return apiClient.get<StaffRecord[]>(`/api/staff/${phcId}`);
}

export async function createStaff(payload: CreateStaffPayload): Promise<StaffRecord> {
  return apiClient.post<StaffRecord>('/api/staff', payload);
}

// ─── Resource Requests ────────────────────────────────────────────────────────

export interface ResourceRequest {
  id: string;
  phcId: string;
  resource: string;
  quantity: number;
  priority: string;   // "NORMAL" | "HIGH" | "CRITICAL"
  status: string;     // "PENDING" | "APPROVED" | "REJECTED"
  requestedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceRequestPayload {
  phcId: string;
  resource: string;
  quantity: number;
  priority?: string;
  requestedBy: string;
}

export async function getResourceRequests(): Promise<ResourceRequest[]> {
  return apiClient.get<ResourceRequest[]>('/api/resources');
}

export async function createResourceRequest(
  payload: CreateResourceRequestPayload
): Promise<ResourceRequest> {
  return apiClient.post<ResourceRequest>('/api/resources', payload);
}
