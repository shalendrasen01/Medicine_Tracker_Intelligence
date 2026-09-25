# ML API

## POST /predict/demand

Predicts daily medicine demand and returns a stock risk level.

### Request

```json
{
  "phc_id": "PHC001",
  "medicine_id": "MED001",
  "stock": 500,
  "patient_footfall": 120,
  "temperature": 27.5,
  "disease_cases": 30,
  "day_of_week": 2,
  "month": 6,
  "lag_1": 110,
  "lag_7": 105,
  "rolling_mean_7": 108.4
}
```

### Response

```json
{
  "phc_id": "PHC001",
  "medicine_id": "MED001",
  "predicted_demand": 105.41,
  "risk_level": "HIGH"
}
```


## POST /predict/stockout

Calculates estimated days of stock remaining and the associated risk level.

### Request

```json
{
  "phc_id": "PHC001",
  "medicine_id": "MED001",
  "current_stock": 500,
  "predicted_daily_demand": 105.41
}
```

### Response

```json
{
  "phc_id": "PHC001",
  "medicine_id": "MED001",
  "days_remaining": 4.74,
  "risk_level": "HIGH"
}
```


## POST /optimize

Generates a medicine redistribution plan based on available surplus, destination requirements, and travel distances.

### Request

```json
{
  "sources": [
    {
      "phc_id": "PHC001",
      "medicine_id": "MED001",
      "surplus": 500
    }
  ],
  "destinations": [
    {
      "phc_id": "PHC003",
      "medicine_id": "MED001",
      "required": 300
    }
  ],
  "distances": [
    {
      "source_phc": "PHC001",
      "destination_phc": "PHC003",
      "distance_km": 25
    }
  ]
}
```

### Response

```json
{
  "redistribution_plan": [
    {
      "source_phc": "PHC001",
      "destination_phc": "PHC003",
      "quantity": 300,
      "distance_km": 25
    }
  ]
}
```

