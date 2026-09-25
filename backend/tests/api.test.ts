import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { Server } from "http";
import jwt from "jsonwebtoken";
import app from "../src/app";
import { prisma } from "../src/config/database";

let server: Server;
let baseUrl: string;

const JWT_SECRET = process.env.JWT_SECRET || "medicine_tracker_dev_secret_2026";

const phc1Id = "48bdad4b-ef0b-4517-bd05-38c33da6c9b4";
const phc2Id = "phc-other-isolated-002";

let centralAdminToken: string;
let phc1AdminToken: string;
let stateAdminToken: string;
let otherStateAdminToken: string;
let logisticsToken: string;
let testMedicineId: string;
let testUserId: string;

before(async () => {
  server = app.listen(0);
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 5000;
  baseUrl = `http://localhost:${port}`;

  // Find or create valid user for relational integrity
  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    testUserId = existingUser.id;
  } else {
    const newUser = await prisma.user.create({
      data: {
        name: "Test Admin",
        email: `admin_${Date.now()}@test.com`,
        passwordHash: "$2b$10$wO32F...",
        role: "CENTRAL_ADMIN",
      },
    });
    testUserId = newUser.id;
  }

  // Generate tokens with valid userId
  centralAdminToken = jwt.sign(
    { userId: testUserId, role: "CENTRAL_ADMIN", stateId: null, phcId: null },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  phc1AdminToken = jwt.sign(
    { userId: testUserId, role: "PHC_ADMIN", stateId: null, phcId: phc1Id },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  stateAdminToken = jwt.sign(
    { userId: testUserId, role: "STATE_ADMIN", stateId: "", phcId: null },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  otherStateAdminToken = jwt.sign(
    { userId: testUserId, role: "STATE_ADMIN", stateId: "other-foreign-state-uuid", phcId: null },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  logisticsToken = jwt.sign(
    { userId: testUserId, role: "LOGISTICS_COORDINATOR", stateId: null, phcId: null },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Ensure test medicine exists
  let med = await prisma.medicine.findFirst({
    where: { name: "Test Paracetamol 500mg" },
  });
  if (!med) {
    med = await prisma.medicine.create({
      data: {
        name: "Test Paracetamol 500mg",
        category: "Analgesic",
        unit: "tablets",
      },
    });
  }
  testMedicineId = med.id;
});

after(async () => {
  server.close();
});

describe("API Test Suite", () => {
  // 1. Health Endpoint
  describe("Health Endpoint", () => {
    it("GET /health should return 200 with status ok and connected services", async () => {
      const res = await fetch(`${baseUrl}/health`);
      assert.equal(res.status, 200);

      const data = await res.json();
      assert.equal(data.status, "ok");
      assert.equal(data.services.database, "connected");
      assert.equal(data.services.redis, "connected");
    });
  });

  // 2. Validation
  describe("Validation", () => {
    it("POST /api/auth/login should return 400 when body fails Zod schema", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "invalid-email" }),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.message, "Validation failed");
      assert.ok(data.errors);
    });

    it("POST /api/inventory should return 400 on negative quantity", async () => {
      const res = await fetch(`${baseUrl}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${centralAdminToken}`,
        },
        body: JSON.stringify({
          phcId: phc1Id,
          medicineId: testMedicineId,
          quantity: -10,
          minStock: 20,
        }),
      });

      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.message, "Validation failed");
    });
  });

  // 3. Login & Invalid Login
  describe("Authentication Endpoints", () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    it("POST /api/auth/register should successfully register a new user", async () => {
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test User",
          email: uniqueEmail,
          password: "password123",
          role: "PHC_ADMIN",
          phcId: phc1Id,
        }),
      });

      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.user.email, uniqueEmail);
    });

    it("POST /api/auth/login should return 401 on wrong password", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: uniqueEmail,
          password: "wrongpassword",
        }),
      });

      assert.equal(res.status, 401);
      const data = await res.json();
      assert.equal(data.message, "Invalid credentials");
    });

    it("POST /api/auth/login should return 401 for non-existent user", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "nobody@example.com",
          password: "password123",
        }),
      });

      assert.equal(res.status, 401);
      const data = await res.json();
      assert.equal(data.message, "Invalid credentials");
    });

    it("POST /api/auth/login should succeed with valid credentials and return JWT", async () => {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: uniqueEmail,
          password: "password123",
        }),
      });

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(data.token);
    });
  });

  // 4. JWT Authentication Middleware
  describe("JWT Authentication", () => {
    it("should reject requests missing Authorization header with 401", async () => {
      const res = await fetch(`${baseUrl}/api/medicines`);
      assert.equal(res.status, 401);
      const data = await res.json();
      assert.equal(data.message, "Authentication required");
    });

    it("should reject invalid/malformed tokens with 401", async () => {
      const res = await fetch(`${baseUrl}/api/medicines`, {
        headers: { Authorization: "Bearer bogus-token-1234" },
      });
      assert.equal(res.status, 401);
      const data = await res.json();
      assert.equal(data.message, "Invalid or expired token");
    });

    it("should permit requests with valid JWT", async () => {
      const res = await fetch(`${baseUrl}/api/medicines`, {
        headers: { Authorization: `Bearer ${centralAdminToken}` },
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data));
    });
  });

  // 5. RBAC
  describe("Role-Based Access Control (RBAC)", () => {
    it("should deny PHC_ADMIN from creating medicines (CENTRAL_ADMIN only)", async () => {
      const res = await fetch(`${baseUrl}/api/medicines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${phc1AdminToken}`,
        },
        body: JSON.stringify({
          name: "Unauthorized Medicine",
          unit: "boxes",
        }),
      });

      assert.equal(res.status, 403);
      const data = await res.json();
      assert.equal(data.message, "Access denied");
    });

    it("should allow CENTRAL_ADMIN to create medicine", async () => {
      const uniqueMedName = `Med_${Date.now()}`;
      const res = await fetch(`${baseUrl}/api/medicines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${centralAdminToken}`,
        },
        body: JSON.stringify({
          name: uniqueMedName,
          category: "General",
          unit: "vials",
        }),
      });

      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.name, uniqueMedName);
    });
  });

  // 6. PHC Isolation
  describe("PHC Resource Isolation", () => {
    it("should prevent PHC_ADMIN from viewing another PHC's inventory", async () => {
      const res = await fetch(`${baseUrl}/api/inventory/${phc2Id}`, {
        headers: { Authorization: `Bearer ${phc1AdminToken}` },
      });

      assert.equal(res.status, 403);
      const data = await res.json();
      assert.equal(data.message, "Access denied: unauthorized for this PHC");
    });

    it("should permit PHC_ADMIN to view their own PHC inventory", async () => {
      const res = await fetch(`${baseUrl}/api/inventory/${phc1Id}`, {
        headers: { Authorization: `Bearer ${phc1AdminToken}` },
      });

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data));
    });
  });

  // 7. State Isolation
  describe("State Resource Isolation", () => {
    it("should prevent STATE_ADMIN from modifying inventory of a PHC outside their state", async () => {
      const res = await fetch(`${baseUrl}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${otherStateAdminToken}`,
        },
        body: JSON.stringify({
          phcId: phc1Id,
          medicineId: testMedicineId,
          quantity: 100,
          minStock: 20,
        }),
      });

      assert.equal(res.status, 403);
      const data = await res.json();
      assert.equal(data.message, "Access denied: unauthorized for this PHC");
    });

    it("should permit STATE_ADMIN to manage inventory of a PHC inside their state", async () => {
      const res = await fetch(`${baseUrl}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${stateAdminToken}`,
        },
        body: JSON.stringify({
          phcId: phc1Id,
          medicineId: testMedicineId,
          quantity: 120,
          minStock: 30,
        }),
      });

      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.quantity, 120);
    });
  });

  // 8. Inventory Flow
  describe("Inventory API Flow", () => {
    it("should upsert inventory and retrieve it", async () => {
      const postRes = await fetch(`${baseUrl}/api/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${centralAdminToken}`,
        },
        body: JSON.stringify({
          phcId: phc1Id,
          medicineId: testMedicineId,
          quantity: 250,
          minStock: 50,
        }),
      });

      assert.equal(postRes.status, 201);
      const posted = await postRes.json();
      assert.equal(posted.quantity, 250);

      const getRes = await fetch(`${baseUrl}/api/inventory/${phc1Id}`, {
        headers: { Authorization: `Bearer ${centralAdminToken}` },
      });
      assert.equal(getRes.status, 200);
      const items = await getRes.json();
      assert.ok(items.some((i: any) => i.medicineId === testMedicineId));
    });
  });

  // 9. Transfers Flow
  describe("Transfers API Flow", () => {
    let createdTransferId: string;

    it("should allow creating a transfer request", async () => {
      const res = await fetch(`${baseUrl}/api/transfers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${phc1AdminToken}`,
        },
        body: JSON.stringify({
          fromPhcId: phc1Id,
          toPhcId: "target-phc-002",
          medicineId: testMedicineId,
          quantity: 25,
        }),
      });

      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.fromPhcId, phc1Id);
      assert.equal(data.quantity, 25);
      createdTransferId = data.id;
    });

    it("should retrieve transfer records", async () => {
      const res = await fetch(`${baseUrl}/api/transfers`, {
        headers: { Authorization: `Bearer ${phc1AdminToken}` },
      });

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data));
      assert.ok(data.some((t: any) => t.id === createdTransferId));
    });
  });

  // 10. Shipments Flow
  describe("Shipments API Flow", () => {
    let transferIdForShipment: string;
    let createdShipmentId: string;

    before(async () => {
      const tx = await prisma.transfer.create({
        data: {
          fromPhcId: phc1Id,
          toPhcId: "phc-target-shipment",
          medicineId: testMedicineId,
          quantity: 15,
          requestedById: testUserId,
        },
      });
      transferIdForShipment = tx.id;
    });

    it("should create a shipment", async () => {
      const res = await fetch(`${baseUrl}/api/shipments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${logisticsToken}`,
        },
        body: JSON.stringify({
          transferId: transferIdForShipment,
          trackingNo: "TRK-TEST-999",
        }),
      });

      assert.equal(res.status, 201);
      const data = await res.json();
      assert.equal(data.trackingNo, "TRK-TEST-999");
      createdShipmentId = data.id;
    });

    it("should update shipment status to DISPATCHED", async () => {
      const res = await fetch(
        `${baseUrl}/api/shipments/${createdShipmentId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${logisticsToken}`,
          },
          body: JSON.stringify({ status: "DISPATCHED" }),
        }
      );

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.status, "DISPATCHED");
      assert.ok(data.dispatchedAt);
    });
  });

  // 11. Alerts Flow
  describe("Alerts API Flow", () => {
    let alertId: string;

    before(async () => {
      const alert = await prisma.alert.create({
        data: {
          phcId: phc1Id,
          medicineId: testMedicineId,
          type: "LOW_STOCK",
          message: "Automated test alert",
          isRead: false,
        },
      });
      alertId = alert.id;
    });

    it("should retrieve alerts for authorized PHC admin", async () => {
      const res = await fetch(`${baseUrl}/api/alerts`, {
        headers: { Authorization: `Bearer ${phc1AdminToken}` },
      });

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok(Array.isArray(data));
      assert.ok(data.some((a: any) => a.id === alertId));
    });

    it("should mark alert as read", async () => {
      const res = await fetch(`${baseUrl}/api/alerts/${alertId}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${phc1AdminToken}` },
      });

      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.isRead, true);
    });
  });

  // 12. Predictions & ML Integration Flow
  describe("Predictions & ML API Flow", () => {
    it("should reject unauthenticated request to predictions health", async () => {
      const res = await fetch(`${baseUrl}/api/predictions/health`);
      assert.equal(res.status, 401);
    });

    it("should return ML service health status when authenticated", async () => {
      const res = await fetch(`${baseUrl}/api/predictions/health`, {
        headers: { Authorization: `Bearer ${phc1AdminToken}` },
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.ok("online" in data);
      assert.ok("status" in data);
    });

    it("should return 400 on demand forecast with invalid schema", async () => {
      const res = await fetch(`${baseUrl}/api/predictions/demand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${phc1AdminToken}`,
        },
        body: JSON.stringify({
          phc_id: phc1Id,
          // Missing medicine_id and required numeric fields
        }),
      });
      assert.equal(res.status, 400);
    });

    it("should prevent PHC_ADMIN from requesting demand forecast for other PHC", async () => {
      const res = await fetch(`${baseUrl}/api/predictions/demand`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${phc1AdminToken}`,
        },
        body: JSON.stringify({
          phc_id: "other-unauthorized-phc",
          medicine_id: testMedicineId,
          stock: 100,
          patient_footfall: 50,
          temperature: 25,
          disease_cases: 2,
          day_of_week: 1,
          month: 5,
          lag_1: 10,
          lag_7: 12,
          rolling_mean_7: 11,
        }),
      });
      assert.equal(res.status, 403);
    });

    it("should reject optimize endpoint for unauthorized PHC_ADMIN", async () => {
      const res = await fetch(`${baseUrl}/api/predictions/optimize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${phc1AdminToken}`,
        },
        body: JSON.stringify({
          sources: [{ phc_id: phc1Id, medicine_id: testMedicineId, surplus: 50 }],
          destinations: [{ phc_id: "other-phc", medicine_id: testMedicineId, required: 50 }],
          distances: [{ source_phc: phc1Id, destination_phc: "other-phc", distance_km: 20 }],
        }),
      });
      assert.equal(res.status, 403);
    });

    it("should fetch aggregated PHC inventory predictions with fallback support", async () => {
      const res = await fetch(`${baseUrl}/api/predictions/phc/${phc1Id}`, {
        headers: { Authorization: `Bearer ${phc1AdminToken}` },
      });
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.phcId, phc1Id);
      assert.ok(Array.isArray(data.items));
    });
  });
});

