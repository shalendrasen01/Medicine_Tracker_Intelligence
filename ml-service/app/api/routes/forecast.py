from pathlib import Path

from app.services.demand_risk import get_demand_risk
import joblib
import pandas as pd
from fastapi import APIRouter

from app.api.schemas import (
    ForecastRequest,
    ForecastResponse,
    StockoutRequest,
    StockoutResponse,
)

from app.services.stockout import (
    calculate_stockout_days,
    get_stockout_risk,
)


router = APIRouter(
    prefix="/predict",
    tags=["Prediction"],
)


MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "models"
    / "demand_xgboost.pkl"
)

model = joblib.load(MODEL_PATH)


FEATURE_COLUMNS = [
    "stock",
    "patient_footfall",
    "temperature",
    "disease_cases",
    "day_of_week",
    "month",
    "lag_1",
    "lag_7",
    "rolling_mean_7",
]


@router.post(
    "/demand",
    response_model=ForecastResponse,
)
def predict_demand(
    request: ForecastRequest,
):
    input_data = pd.DataFrame(
        [
            {
                "stock": request.stock,
                "patient_footfall": request.patient_footfall,
                "temperature": request.temperature,
                "disease_cases": request.disease_cases,
                "day_of_week": request.day_of_week,
                "month": request.month,
                "lag_1": request.lag_1,
                "lag_7": request.lag_7,
                "rolling_mean_7": request.rolling_mean_7,
            }
        ]
    )

    

    prediction = model.predict(
        input_data[FEATURE_COLUMNS]
    )[0]

    prediction = max(0, float(prediction))

    risk_level = get_demand_risk(
        request.stock,
        prediction,
    )

    return ForecastResponse(
        phc_id=request.phc_id,
        medicine_id=request.medicine_id,
        predicted_demand=round(
            prediction,
            2,
        ),
        risk_level=risk_level,
    )


@router.post(
    "/stockout",
    response_model=StockoutResponse,
)
def predict_stockout(
    request: StockoutRequest,
):
    days_remaining = calculate_stockout_days(
        request.current_stock,
        request.predicted_daily_demand,
    )

    risk_level = get_stockout_risk(
        days_remaining
    )

    return StockoutResponse(
        phc_id=request.phc_id,
        medicine_id=request.medicine_id,
        days_remaining=round(
            days_remaining,
            2,
        ) if days_remaining != float("inf") else days_remaining,
        risk_level=risk_level,
    )