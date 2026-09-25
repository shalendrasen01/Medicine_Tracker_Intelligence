import { z } from "zod";

// Role enum matching Prisma schema
export const RoleEnum = z.enum([
  "CENTRAL_ADMIN",
  "STATE_ADMIN",
  "PHC_ADMIN",
  "LOGISTICS_COORDINATOR",
]);

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: RoleEnum,
  stateId: z.string().optional().nullable(),
  phcId: z.string().optional().nullable(),
});

// Medicine schema
export const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  category: z.string().optional().nullable(),
  unit: z.string().min(1, "Unit is required"),
});

// Inventory schema
export const inventorySchema = z.object({
  phcId: z.string().min(1, "PHC ID is required"),
  medicineId: z.string().min(1, "Medicine ID is required"),
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"),
  minStock: z.number().int().min(0, "Min stock must be a non-negative integer"),
});

// Transfer schema
export const transferSchema = z.object({
  fromPhcId: z.string().min(1, "Source PHC ID is required"),
  toPhcId: z.string().min(1, "Destination PHC ID is required"),
  medicineId: z.string().min(1, "Medicine ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  requestedById: z.string().optional(),
});

// Shipment schemas
export const shipmentSchema = z.object({
  transferId: z.string().min(1, "Transfer ID is required"),
  trackingNo: z.string().optional().nullable(),
});

export const shipmentStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "DISPATCHED",
    "IN_TRANSIT",
    "DELIVERED",
    "CANCELLED",
  ]),
});

// Bed schema
export const bedSchema = z.object({
  phcId: z.string().min(1, "PHC ID is required"),
  totalBeds: z.number().int().min(0, "Total beds must be a non-negative integer"),
  occupied: z.number().int().min(0, "Occupied beds must be a non-negative integer"),
});

// Patient Data schema
export const patientDataSchema = z.object({
  phcId: z.string().min(1, "PHC ID is required"),
  totalVisits: z.number().int().min(0, "Total visits must be a non-negative integer"),
  admissions: z.number().int().min(0, "Admissions must be a non-negative integer"),
  discharges: z.number().int().min(0, "Discharges must be a non-negative integer"),
});

// Resource Request schema
export const resourceRequestSchema = z.object({
  phcId: z.string().min(1, "PHC ID is required"),
  resource: z.string().min(1, "Resource name is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]).default("NORMAL"),
  requestedBy: z.string().optional(),
});

// Staff schema
export const staffSchema = z.object({
  phcId: z.string().min(1, "PHC ID is required"),
  name: z.string().min(1, "Staff name is required"),
  role: z.string().min(1, "Role is required"),
  count: z.number().int().positive("Count must be positive").default(1),
});

// Audit schema
export const auditSchema = z.object({
  action: z.string().min(1, "Action is required"),
  entity: z.string().min(1, "Entity is required"),
  userId: z.string().optional().nullable(),
  entityId: z.string().optional().nullable(),
  details: z.string().optional().nullable(),
});

// Job schemas
export const testJobSchema = z.object({
  message: z.string().optional(),
}).optional();

export const lowStockJobSchema = z.object({
  phcId: z.string().optional(),
  threshold: z.number().optional(),
  message: z.string().optional(),
}).optional();
