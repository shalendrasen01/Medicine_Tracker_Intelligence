/**
 * Public API surface for the frontend API layer.
 *
 * Import from '@/lib/api' instead of individual files:
 *   import { login, logout } from '@/lib/api';
 *   import { getAlerts, markAlertRead } from '@/lib/api';
 */

// Core client utilities
export { apiClient, ApiError, setToken, clearToken, setUser, getUser } from './client';

// Authentication
export { login, register, logout } from './auth';
export type { AuthUser, LoginPayload, RegisterPayload, RegisterResponse, UserRole } from './auth';

// Medicines
export { getMedicines, createMedicine } from './medicines';
export type { Medicine, CreateMedicinePayload } from './medicines';

// Inventory
export { getInventoryByPhc, upsertInventory } from './inventory';
export type { InventoryRecord, UpsertInventoryPayload } from './inventory';

// Alerts
export { getAlerts, markAlertRead } from './alerts';
export type { BackendAlert } from './alerts';

// Transfers
export { getTransfers, createTransfer } from './transfers';
export type { BackendTransfer, CreateTransferPayload } from './transfers';

// Shipments
export { getShipments, createShipment, updateShipmentStatus } from './shipments';
export type {
  BackendShipment,
  CreateShipmentPayload,
  UpdateShipmentStatusPayload,
} from './shipments';

// PHC data (beds, patients, staff, resources)
export {
  getBedsByPhc,
  upsertBeds,
  getPatientDataByPhc,
  createPatientData,
  getStaffByPhc,
  createStaff,
  getResourceRequests,
  createResourceRequest,
} from './phc';
export type {
  BedRecord,
  PatientDataRecord,
  StaffRecord,
  ResourceRequest,
  UpsertBedPayload,
  CreatePatientDataPayload,
  CreateStaffPayload,
  CreateResourceRequestPayload,
} from './phc';

// Audit logs
export { getAuditLogs, createAuditLog } from './audit';
export type { AuditLog, CreateAuditLogPayload } from './audit';
