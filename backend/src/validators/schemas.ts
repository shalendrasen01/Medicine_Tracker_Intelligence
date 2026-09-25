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

// ML Prediction Schemas
export const demandForecastSchema = z.object({
  phc_id: z.string().min(1, "PHC ID is required"),
  medicine_id: z.string().min(1, "Medicine ID is required"),
  stock: z.number().min(0, "Stock must be non-negative"),
  patient_footfall: z.number().min(0, "Patient footfall must be non-negative"),
  temperature: z.number(),
  disease_cases: z.number().min(0, "Disease cases must be non-negative"),
  day_of_week: z.number().int().min(0).max(6, "Day of week must be between 0 and 6"),
  month: z.number().int().min(1).max(12, "Month must be between 1 and 12"),
  lag_1: z.number().min(0, "Lag 1 must be non-negative"),
  lag_7: z.number().min(0, "Lag 7 must be non-negative"),
  rolling_mean_7: z.number().min(0, "Rolling mean 7 must be non-negative"),
});

export const stockoutPredictionSchema = z.object({
  phc_id: z.string().min(1, "PHC ID is required"),
  medicine_id: z.string().min(1, "Medicine ID is required"),
  current_stock: z.number().min(0, "Current stock must be non-negative"),
  predicted_daily_demand: z.number().min(0, "Predicted daily demand must be non-negative"),
});

export const optimizationSchema = z.object({
  sources: z.array(
    z.object({
      phc_id: z.string().min(1, "Source PHC ID is required"),
      medicine_id: z.string().min(1, "Source Medicine ID is required"),
      surplus: z.number().min(0, "Surplus must be non-negative"),
    })
  ).min(1, "At least one source is required"),
  destinations: z.array(
    z.object({
      phc_id: z.string().min(1, "Destination PHC ID is required"),
      medicine_id: z.string().min(1, "Destination Medicine ID is required"),
      required: z.number().min(0, "Required quantity must be non-negative"),
    })
  ).min(1, "At least one destination is required"),
  distances: z.array(
    z.object({
      source_phc: z.string().min(1, "Source PHC is required"),
      destination_phc: z.string().min(1, "Destination PHC is required"),
      distance_km: z.number().min(0, "Distance must be non-negative"),
    })
  ).min(1, "At least one distance record is required"),
});

