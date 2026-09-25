# Machine Learning Integration Guide

This document details the architectural integration connecting the Next.js Frontend, Node.js/Express Backend, and FastAPI Machine Learning Service for the **Medicine Tracker Intelligence** platform.

---

## 1. Architectural Architecture

```
Frontend (Next.js @ :3000)
       │
       │ HTTP / JSON (Bearer JWT Authorization)
       ▼
Backend API (Express / Prisma @ :5000)
       │
       │ HTTP / JSON (Internal Service-to-Service)
       ▼
ML Microservice (FastAPI / XGBoost / OR-Tools @ :8000)
```

> **Security Principle:** The frontend **never** connects directly to the ML microservice. Centralized authentication, role-based access control (RBAC), and facility resource isolation are enforced at the backend gateway before dispatching requests to the ML microservice.

---

## 2. Service Responsibilities

| Service | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14, React, TailwindCSS | Dashboards, visualizations, stockout alerts, and redistribution review. |
| **Backend** | Node.js, Express, TypeScript, Prisma 7, PostgreSQL, Redis | User auth, RBAC, database queries, inventory records, audit logging, and ML proxy. |
| **ML Service** | Python, FastAPI, XGBoost, Google OR-Tools | Demand regression modeling, stockout duration estimation, and transport cost optimization. |

---

## 3. Endpoint Mapping

| Frontend API Method | Backend Express Route | Role Required | Target ML Service Endpoint |
| :--- | :--- | :--- | :--- |
| `getPredictionsHealth()` | `GET /api/predictions/health` | Authenticated | `GET /health` |
| `predictDemand(payload)` | `POST /api/predictions/demand` | `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN` | `POST /predict/demand` |
| `predictStockout(payload)` | `POST /api/predictions/stockout` | `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN` | `POST /predict/stockout` |
| `optimizeRedistribution(payload)` | `POST /api/predictions/optimize` | `CENTRAL_ADMIN`, `STATE_ADMIN`, `LOGISTICS_COORDINATOR` | `POST /optimize` |
| `getPhcPredictions(phcId)` | `GET /api/predictions/phc/:phcId` | `CENTRAL_ADMIN`, `STATE_ADMIN`, `PHC_ADMIN` | Joins Postgres Inventory + `POST /predict/demand` |

---

## 4. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/medicine_tracker"
JWT_SECRET="your_jwt_secret"
REDIS_URL="redis://localhost:6379"
ML_SERVICE_URL="http://127.0.0.1:8000"
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

---

## 5. Local Startup Sequence

For complete local operation:

1. **Start Infrastructure Services:**
   - PostgreSQL (port `5432`)
   - Redis (port `6379`)

2. **Start ML Microservice:**
   ```bash
   cd ml-service
   pip install -r requirements.txt
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

3. **Start Backend API:**
   ```bash
   cd backend
   npm run dev
   # Runs on http://localhost:5000
   ```

4. **Start Frontend Application:**
   ```bash
   cd frontend
   npm run dev
   # Runs on http://localhost:3000
   ```

---

## 6. Fault Tolerance & Failure Resilience

1. **Service Unavailability (`503`):**
   - If the ML service is down (`ECONNREFUSED`), `MLService` catches the failure and returns a structured `503 Service Unavailable` with a descriptive message.
2. **Aggregated Dashboard Fallback:**
   - The `GET /api/predictions/phc/:phcId` endpoint automatically falls back to deterministic inventory calculations if the ML service is offline, ensuring the user dashboard is always operational.
3. **Timeouts:**
   - Individual model inferences (`/predict/demand`, `/predict/stockout`) have a strict 5000ms abort timeout.
   - Linear programming optimization (`/optimize`) has a 10000ms abort timeout.
4. **Infinity & NaN Handling:**
   - When demand is 0, Python returns `Infinity`. The backend `safeJsonParse` sanitizes unquoted `Infinity` and `NaN` tokens before parsing to prevent JSON syntax errors.

---

## 7. Note for Person 3 (ML Service Maintainer)

> [!WARNING]
> **Circular Import in `ml-service/app/services/stockout.py`**
> - In commit `f217e88d`, `calculate_stockout_days` and `get_stockout_risk` were removed from `ml-service/app/services/stockout.py` and replaced with an import from itself:
>   ```python
>   from app.services.stockout import (calculate_stockout_days, get_stockout_risk)
>   ```
> - This causes `POST /predict/stockout` to fail with an `ImportError`.
> - **Action Required:** Restore the original implementations of `calculate_stockout_days` and `get_stockout_risk` in `ml-service/app/services/stockout.py`.
