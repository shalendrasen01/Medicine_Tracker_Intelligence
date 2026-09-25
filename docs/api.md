
# Medicine Tracker Intelligence - Backend API Documentation

Welcome to the backend API reference for **Medicine Tracker Intelligence**. This document covers authentication, roles and permissions, error handling, real-time events, and all REST endpoints.

---

## 1. Authentication & Security

The API uses **JSON Web Tokens (JWT)** for authentication.

### Authorization Header
Protected routes require the `Authorization` header with a Bearer token:
```http
Authorization: Bearer <your_jwt_token>
```

### JWT Token Payload
```json
{
  "userId": "uuid-v4",
  "role": "CENTRAL_ADMIN | STATE_ADMIN | PHC_ADMIN | LOGISTICS_COORDINATOR",
  "stateId": "uuid-v4 | null",
  "phcId": "uuid-v4 | null",
  "iat": 1774500000,
  "exp": 1774586400
}
```
- **Token Validity:** 1 day (`1d`)
- **Signing Secret:** `JWT_SECRET` environment variable

---

## 2. Roles & Resource-Level RBAC

The system enforces multi-tier role and resource isolation:

| Role | Scope | Description |
| :--- | :--- | :--- |
| `CENTRAL_ADMIN` | **System-Wide** | Unrestricted access across all states, PHCs, medicines, inventory, transfers, shipments, logs, and background jobs. |
| `STATE_ADMIN` | **State-Level** | Access restricted to PHCs located within districts of their assigned `stateId`. |
| `PHC_ADMIN` | **PHC-Level** | Strictly isolated to records belonging to their assigned `phcId`. Cross-PHC access is denied (HTTP 403). |
| `LOGISTICS_COORDINATOR` | **Logistics-Specific** | Manages shipments and views transfers and system logistics alerts. |

> **Note:** District is a database relational entity (`State` -> `District` -> `PHC`), not a user role.

---

## 3. Real-Time Socket.IO Events

The backend hosts a Socket.IO server on the same HTTP server port.

### Connection
- **Endpoint:** `ws://<host>:<port>`
- **CORS:** Allowed for configured frontend origins.

### Emitted Events
| Event Name | Trigger | Payload |
| :--- | :--- | :--- |
| `inventory:updated` | Inventory upserted | Updated Inventory object |
| `alert:created` | Stock drops below `minStock` | New Alert object |
| `transfer:created` | Transfer requested | New Transfer object |
| `transfer:updated` | Transfer status changed | Updated Transfer object |
| `shipment:updated` | Shipment created or status changed | Updated Shipment object |

### Client Room Subscriptions
- `join:phc` (payload: `phcId`)
- `leave:phc` (payload: `phcId`)

---

## 4. Error Handling & Status Codes

All errors return a consistent JSON response:

```json
{
  "message": "Error description message",
  "errors": {
    "field": ["Field specific validation error"]
  }
}
```

### Standard Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or malformed payload.
- `401 Unauthorized`: Missing, invalid, or expired JWT token.
- `403 Forbidden`: Access denied due to role or PHC/State ownership restrictions.
- `404 Not Found`: Target resource or route does not exist.
- `409 Conflict`: Unique constraint violation (e.g. email already exists).
- `500 Internal Server Error`: Unhandled server exception (stack traces omitted in production).
- `503 Service Unavailable`: Database or Redis connectivity failure.

---

## 5. API Endpoints

### 5.1 System & Health

#### `GET /health`
Probes API server, PostgreSQL database, and Redis/Memurai.

- **Auth:** None
- **Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-09-25T19:16:23.815Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

### 5.2 Authentication

#### `POST /api/auth/register`
Register a new user account.

- **Auth:** None
- **Request Body:**
```json
{
  "name": "Dr. Sharma",
  "email": "sharma@phc.example.com",
  "password": "securePassword123",
  "role": "PHC_ADMIN",
  "stateId": "b18bcf51-2487-43cf-830b-d2429a39dfa2",
  "phcId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
}
```
- **Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "c1f763e0-058f-4cf6-9214-bf03a0889f81",
    "name": "Dr. Sharma",
    "email": "sharma@phc.example.com",
    "role": "PHC_ADMIN",
    "stateId": "b18bcf51-2487-43cf-830b-d2429a39dfa2",
    "phcId": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d"
  }
}
```

#### `POST /api/auth/login`
Authenticate with email and password.

- **Auth:** None
- **Request Body:**
```json
{
  "email": "sharma@phc.example.com",
  "password": "securePassword123"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5.3 Medicines

#### `GET /api/medicines`
Retrieve catalog of medicines.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`
- **Response (200 OK):**
```json
[
  {
    "id": "med-uuid-1",
    "name": "Paracetamol 500mg",
    "category": "Analgesics",
    "unit": "tablets",
    "createdAt": "2026-09-24T00:00:00.000Z",
    "updatedAt": "2026-09-24T00:00:00.000Z"
  }
]
```

#### `POST /api/medicines`
Create a new medicine in the master catalog.

- **Auth:** `CENTRAL_ADMIN`
- **Request Body:**
```json
{
  "name": "Amoxicillin 250mg",
  "category": "Antibiotics",
  "unit": "capsules"
}
```
- **Response (201 Created):**
```json
{
  "id": "med-uuid-2",
  "name": "Amoxicillin 250mg",
  "category": "Antibiotics",
  "unit": "capsules",
  "createdAt": "2026-09-26T00:00:00.000Z",
  "updatedAt": "2026-09-26T00:00:00.000Z"
}
```

---

### 5.4 Inventory

#### `GET /api/inventory/:phcId`
Fetch inventory for a specific PHC.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN` (same state), `PHC_ADMIN` (own PHC)
- **Response (200 OK):**
```json
[
  {
    "id": "inv-uuid-1",
    "phcId": "phc-uuid-1",
    "medicineId": "med-uuid-1",
    "quantity": 150,
    "minStock": 200,
    "updatedAt": "2026-09-26T00:00:00.000Z",
    "medicine": {
      "id": "med-uuid-1",
      "name": "Paracetamol 500mg",
      "unit": "tablets"
    }
  }
]
```

#### `POST /api/inventory`
Upsert inventory quantities and minimum stock thresholds.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN` (same state), `PHC_ADMIN` (own PHC)
- **Request Body:**
```json
{
  "phcId": "phc-uuid-1",
  "medicineId": "med-uuid-1",
  "quantity": 300,
  "minStock": 100
}
```
- **Response (201 Created):**
```json
{
  "id": "inv-uuid-1",
  "phcId": "phc-uuid-1",
  "medicineId": "med-uuid-1",
  "quantity": 300,
  "minStock": 100,
  "updatedAt": "2026-09-26T00:00:00.000Z"
}
```

---

### 5.5 Transfers

#### `GET /api/transfers`
List stock transfers (scoped to accessible PHCs).

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`, `LOGISTICS_COORDINATOR`
- **Response (200 OK):**
```json
[
  {
    "id": "tx-uuid-1",
    "fromPhcId": "phc-uuid-1",
    "toPhcId": "phc-uuid-2",
    "medicineId": "med-uuid-1",
    "quantity": 50,
    "status": "PENDING",
    "requestedById": "user-uuid-1",
    "createdAt": "2026-09-26T00:00:00.000Z",
    "medicine": {
      "id": "med-uuid-1",
      "name": "Paracetamol 500mg"
    }
  }
]
```

#### `POST /api/transfers`
Request a new transfer of medicine from one PHC to another.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN` (source in state), `PHC_ADMIN` (source is own PHC)
- **Request Body:**
```json
{
  "fromPhcId": "phc-uuid-1",
  "toPhcId": "phc-uuid-2",
  "medicineId": "med-uuid-1",
  "quantity": 50
}
```
- **Response (201 Created):**
```json
{
  "id": "tx-uuid-1",
  "fromPhcId": "phc-uuid-1",
  "toPhcId": "phc-uuid-2",
  "medicineId": "med-uuid-1",
  "quantity": 50,
  "status": "PENDING",
  "requestedById": "user-uuid-1",
  "createdAt": "2026-09-26T00:00:00.000Z"
}
```

---

### 5.6 Shipments

#### `GET /api/shipments`
List all shipments (scoped to accessible transfers).

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`, `LOGISTICS_COORDINATOR`
- **Response (200 OK):**
```json
[
  {
    "id": "ship-uuid-1",
    "transferId": "tx-uuid-1",
    "status": "PENDING",
    "trackingNo": "TRK-2026-001",
    "dispatchedAt": null,
    "deliveredAt": null,
    "createdAt": "2026-09-26T00:00:00.000Z",
    "transfer": {
      "id": "tx-uuid-1",
      "quantity": 50
    }
  }
]
```

#### `POST /api/shipments`
Create a shipment for an approved transfer.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `LOGISTICS_COORDINATOR`
- **Request Body:**
```json
{
  "transferId": "tx-uuid-1",
  "trackingNo": "TRK-2026-001"
}
```
- **Response (201 Created):**
```json
{
  "id": "ship-uuid-1",
  "transferId": "tx-uuid-1",
  "status": "PENDING",
  "trackingNo": "TRK-2026-001",
  "createdAt": "2026-09-26T00:00:00.000Z"
}
```

#### `PATCH /api/shipments/:id/status`
Update shipment delivery status. Automatically updates associated transfer status to `IN_TRANSIT` or `DELIVERED`.

- **Auth:** `CENTRAL_ADMIN`, `LOGISTICS_COORDINATOR`
- **Request Body:**
```json
{
  "status": "DISPATCHED"
}
```
- **Allowed Statuses:** `"PENDING"`, `"DISPATCHED"`, `"IN_TRANSIT"`, `"DELIVERED"`, `"CANCELLED"`
- **Response (200 OK):**
```json
{
  "id": "ship-uuid-1",
  "status": "DISPATCHED",
  "dispatchedAt": "2026-09-26T00:05:00.000Z"
}
```

---

### 5.7 Alerts

#### `GET /api/alerts`
Retrieve alerts (filtered to user's authorized PHCs).

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`, `LOGISTICS_COORDINATOR`
- **Response (200 OK):**
```json
[
  {
    "id": "alert-uuid-1",
    "phcId": "phc-uuid-1",
    "medicineId": "med-uuid-1",
    "type": "LOW_STOCK",
    "message": "Low stock alert: Paracetamol 500mg at PHC Central",
    "isRead": false,
    "createdAt": "2026-09-26T00:00:00.000Z"
  }
]
```

#### `PATCH /api/alerts/:id/read`
Mark an alert as read.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN` (same state), `PHC_ADMIN` (own PHC), `LOGISTICS_COORDINATOR`
- **Response (200 OK):**
```json
{
  "id": "alert-uuid-1",
  "isRead": true
}
```

---

### 5.8 Beds

#### `GET /api/beds/:phcId`
Retrieve bed availability for a PHC.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`
- **Response (200 OK):**
```json
{
  "id": "bed-uuid-1",
  "phcId": "phc-uuid-1",
  "totalBeds": 50,
  "occupied": 28,
  "updatedAt": "2026-09-26T00:00:00.000Z"
}
```

#### `POST /api/beds`
Update bed capacity and occupancy.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`
- **Request Body:**
```json
{
  "phcId": "phc-uuid-1",
  "totalBeds": 50,
  "occupied": 30
}
```
- **Response (201 Created):**
```json
{
  "id": "bed-uuid-1",
  "phcId": "phc-uuid-1",
  "totalBeds": 50,
  "occupied": 30,
  "updatedAt": "2026-09-26T00:00:00.000Z"
}
```

---

### 5.9 Patient Data

#### `GET /api/patients/:phcId`
Get patient visit and admission statistics.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`
- **Response (200 OK):**
```json
[
  {
    "id": "pat-uuid-1",
    "phcId": "phc-uuid-1",
    "date": "2026-09-26T00:00:00.000Z",
    "totalVisits": 120,
    "admissions": 14,
    "discharges": 10
  }
]
```

#### `POST /api/patients`
Record daily patient statistics.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`
- **Request Body:**
```json
{
  "phcId": "phc-uuid-1",
  "totalVisits": 120,
  "admissions": 14,
  "discharges": 10
}
```
- **Response (201 Created):**
```json
{
  "id": "pat-uuid-1",
  "phcId": "phc-uuid-1",
  "totalVisits": 120,
  "admissions": 14,
  "discharges": 10
}
```

---

### 5.10 Resource Requests

#### `GET /api/resources`
List resource requests.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`, `LOGISTICS_COORDINATOR`
- **Response (200 OK):**
```json
[
  {
    "id": "res-uuid-1",
    "phcId": "phc-uuid-1",
    "resource": "Oxygen Cylinders",
    "quantity": 10,
    "priority": "HIGH",
    "status": "PENDING",
    "requestedBy": "user-uuid-1",
    "createdAt": "2026-09-26T00:00:00.000Z"
  }
]
```

#### `POST /api/resources`
Submit a new emergency or standard resource request.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`
- **Request Body:**
```json
{
  "phcId": "phc-uuid-1",
  "resource": "Oxygen Cylinders",
  "quantity": 10,
  "priority": "HIGH"
}
```
- **Response (201 Created):**
```json
{
  "id": "res-uuid-1",
  "phcId": "phc-uuid-1",
  "resource": "Oxygen Cylinders",
  "quantity": 10,
  "priority": "HIGH",
  "status": "PENDING",
  "requestedBy": "user-uuid-1",
  "createdAt": "2026-09-26T00:00:00.000Z"
}
```

---

### 5.11 Staff

#### `GET /api/staff/:phcId`
Fetch staffing numbers for a PHC.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`
- **Response (200 OK):**
```json
[
  {
    "id": "staff-uuid-1",
    "phcId": "phc-uuid-1",
    "name": "General Nursing",
    "role": "Nurse",
    "count": 6
  }
]
```

#### `POST /api/staff`
Add or record staff members for a PHC.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN`
- **Request Body:**
```json
{
  "phcId": "phc-uuid-1",
  "name": "General Nursing",
  "role": "Nurse",
  "count": 6
}
```
- **Response (201 Created):**
```json
{
  "id": "staff-uuid-1",
  "phcId": "phc-uuid-1",
  "name": "General Nursing",
  "role": "Nurse",
  "count": 6
}
```

---

### 5.12 Audit Logs

#### `GET /api/audit`
Retrieve system audit log trail.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`
- **Response (200 OK):**
```json
[
  {
    "id": "audit-uuid-1",
    "userId": "user-uuid-1",
    "action": "UPDATE_INVENTORY",
    "entity": "Inventory",
    "entityId": "inv-uuid-1",
    "details": "{\"phcId\":\"phc-uuid-1\",\"quantity\":300}",
    "createdAt": "2026-09-26T00:00:00.000Z"
  }
]
```

#### `POST /api/audit`
Manually create an audit entry.

- **Auth:** `CENTRAL_ADMIN`
- **Request Body:**
```json
{
  "action": "CONFIG_UPDATE",
  "entity": "System",
  "details": "{\"setting\":\"threshold_alert\"}"
}
```
- **Response (201 Created):**
```json
{
  "id": "audit-uuid-2",
  "action": "CONFIG_UPDATE",
  "entity": "System",
  "details": "{\"setting\":\"threshold_alert\"}",
  "createdAt": "2026-09-26T00:00:00.000Z"
}
```

---

### 5.13 Background Jobs (BullMQ)

#### `POST /api/jobs/test`
Enqueue a test job to the BullMQ `medicine-jobs` queue.

- **Auth:** `CENTRAL_ADMIN`
- **Request Body (Optional):**
```json
{
  "message": "Custom test message"
}
```
- **Response (200 OK):**
```json
{
  "message": "Job added",
  "jobId": "1"
}
```

#### `POST /api/jobs/low-stock`
Trigger a low stock inspection across PHC inventories.

- **Auth:** `CENTRAL_ADMIN`, `STATE_ADMIN`
- **Request Body (Optional):**
```json
{
  "phcId": "phc-uuid-1",
  "message": "Manual check trigger"
}
```
- **Response (200 OK):**
```json
{
  "message": "Low-stock job added",
  "jobId": "2"
}
```
