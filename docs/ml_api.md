# Machine Learning Service API Contract

This document specifies the exact API contract implemented by the FastAPI ML Service (`ml-service/app`), running by default on port `8000`.

---

## 1. Health Check

Checks if the ML microservice is online and accessible.

- **METHOD:** `GET`
- **PATH:** `/health`
- **REQUEST BODY:** None
- **REQUIRED FIELDS:** None
- **OPTIONAL FIELDS:** None

### Response (200 OK)
```json
{
  "status": "ok"
}
```

---

## 2. Demand Forecast & Risk Level

Predicts daily medicine demand using an XGBoost regression model trained on historical utilization and environmental factors, and computes the stockout risk tier.

- **METHOD:** `POST`
- **PATH:** `/predict/demand`

### Request Body
```json
{
  "phc_id": "PHC001",
  "medicine_id": "MED001",
  "stock": 500.0,
  "patient_footfall": 120.0,
  "temperature": 27.5,
  "disease_cases": 30.0,
  "day_of_week": 2,
  "month": 6,
  "lag_1": 110.0,
  "lag_7": 105.0,
  "rolling_mean_7": 108.4
}
```

### Field Specifications
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `phc_id` | `string` | Non-empty | Target PHC identifier |
| `medicine_id` | `string` | Non-empty | Target Medicine identifier |
| `stock` | `float` | `>= 0` | Current on-hand stock quantity |
| `patient_footfall` | `float` | `>= 0` | Daily patient visits / OPD count |
| `temperature` | `float` | None | Ambient temperature in Celsius |
| `disease_cases` | `float` | `>= 0` | Related disease incidents recorded |
| `day_of_week` | `integer` | `0` to `6` | Day index (0 = Monday, 6 = Sunday) |
| `month` | `integer` | `1` to `12` | Month index (1 = Jan, 12 = Dec) |
| `lag_1` | `float` | `>= 0` | Demand recorded 1 day prior |
| `lag_7` | `float` | `>= 0` | Demand recorded 7 days prior |
| `rolling_mean_7` | `float` | `>= 0` | 7-day rolling average demand |

- **OPTIONAL FIELDS:** None (all 11 fields are mandatory for the XGBoost model).

### Response (200 OK)
```json
{
  "phc_id": "PHC001",
  "medicine_id": "MED001",
  "predicted_demand": 105.41,
  "risk_level": "HIGH"
}
```
*Field Notes:*
- `predicted_demand`: Rounded to 2 decimal places, non-negative (`max(0, prediction)`).
- `risk_level`: String enum: `"CRITICAL" | "HIGH" | "MEDIUM" | "LOW"`.
  - `predicted_demand <= 0` $\rightarrow$ `"LOW"`
  - `stock / predicted_demand < 3` $\rightarrow$ `"CRITICAL"`
  - `stock / predicted_demand < 7` $\rightarrow$ `"HIGH"`
  - `stock / predicted_demand <= 14` $\rightarrow$ `"MEDIUM"`
  - otherwise $\rightarrow$ `"LOW"`

### Error Response (422 Unprocessable Entity)
Returned when payload validation fails (e.g., negative stock, missing feature):
```json
{
  "detail": [
    {
      "loc": ["body", "stock"],
      "msg": "ensure this value is greater than or equal to 0",
      "type": "value_error.number.not_ge"
    }
  ]
}
```

---

## 3. Stockout Risk Prediction

Computes the estimated days of stock remaining and determines the operational stockout risk level.

- **METHOD:** `POST`
- **PATH:** `/predict/stockout`

### Request Body
```json
{
  "phc_id": "PHC001",
  "medicine_id": "MED001",
  "current_stock": 500.0,
  "predicted_daily_demand": 105.41
}
```

### Field Specifications
| Field | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `phc_id` | `string` | Non-empty | Target PHC identifier |
| `medicine_id` | `string` | Non-empty | Target Medicine identifier |
| `current_stock` | `float` | `>= 0` | Current available inventory |
| `predicted_daily_demand` | `float` | `>= 0` | Estimated daily consumption rate |

- **OPTIONAL FIELDS:** None.

### Response (200 OK)
```json
{
  "phc_id": "PHC001",
  "medicine_id": "MED001",
  "days_remaining": 4.74,
  "risk_level": "HIGH"
}
```
*Field Notes:*
- `days_remaining`: Calculated as `current_stock / predicted_daily_demand`. If `predicted_daily_demand <= 0`, returns `Infinity`.
- `risk_level`:
  - `days_remaining == Infinity` $\rightarrow$ `"LOW"`
  - `days_remaining < 3` $\rightarrow$ `"CRITICAL"`
  - `days_remaining < 7` $\rightarrow$ `"HIGH"`
  - `days_remaining <= 14` $\rightarrow$ `"MEDIUM"`
  - otherwise $\rightarrow$ `"LOW"`

### Error Response (422 Unprocessable Entity)
```json
{
  "detail": [
    {
      "loc": ["body", "current_stock"],
      "msg": "ensure this value is greater than or equal to 0",
      "type": "value_error.number.not_ge"
    }
  ]
}
```

---

## 4. Supply Chain Redistribution Optimization

Uses Google OR-Tools (SCIP linear programming solver) to minimize transport cost ($\sum \text{quantity} \times \text{distance}$) while matching surplus PHCs with deficit PHCs for identical medicine IDs.

- **METHOD:** `POST`
- **PATH:** `/optimize`

### Request Body
```json
{
  "sources": [
    {
      "phc_id": "PHC001",
      "medicine_id": "MED001",
      "surplus": 500.0
    }
  ],
  "destinations": [
    {
      "phc_id": "PHC003",
      "medicine_id": "MED001",
      "required": 300.0
    }
  ],
  "distances": [
    {
      "source_phc": "PHC001",
      "destination_phc": "PHC003",
      "distance_km": 25.0
    }
  ]
}
```

### Field Specifications
- **`sources`** (`array` of source PHCs with surplus stock):
  - `phc_id` (`string`): Source facility ID
  - `medicine_id` (`string`): Medicine ID
  - `surplus` (`number`): Surplus inventory units available for dispatch
- **`destinations`** (`array` of destination PHCs in deficit):
  - `phc_id` (`string`): Destination facility ID
  - `medicine_id` (`string`): Medicine ID
  - `required` (`number`): Deficit inventory units needed
- **`distances`** (`array` of route distances):
  - `source_phc` (`string`): Source facility ID
  - `destination_phc` (`string`): Destination facility ID
  - `distance_km` (`number`): Distance between facilities in kilometers
- **OPTIONAL FIELDS:** None.

### Response (200 OK)
```json
{
  "redistribution_plan": [
    {
      "source_phc": "PHC001",
      "destination_phc": "PHC003",
      "quantity": 300.0,
      "distance_km": 25.0
    }
  ]
}
```

### Error Responses
- **500 Internal Server Error:**
  - `{"detail": "No optimal redistribution plan found."}` if supply constraints cannot satisfy demand or solver fails.
- **500 Internal Server Error:**
  - `KeyError` or `TypeError` if required keys or coordinate mappings in `distances` are missing.
