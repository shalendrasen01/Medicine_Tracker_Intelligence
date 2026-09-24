from pydantic import BaseModel, Field


class ForecastRequest(BaseModel):
    phc_id: str
    medicine_id: str

    stock: float = Field(ge=0)
    patient_footfall: float = Field(ge=0)
    temperature: float
    disease_cases: float = Field(ge=0)

    day_of_week: int = Field(ge=0, le=6)
    month: int = Field(ge=1, le=12)

    lag_1: float = Field(ge=0)
    lag_7: float = Field(ge=0)
    rolling_mean_7: float = Field(ge=0)


class ForecastResponse(BaseModel):
    phc_id: str
    medicine_id: str
    predicted_demand: float

class StockoutRequest(BaseModel):
    phc_id: str
    medicine_id: str

    current_stock: float = Field(ge=0)
    predicted_daily_demand: float = Field(ge=0)


class StockoutResponse(BaseModel):
    phc_id: str
    medicine_id: str
    days_remaining: float
    risk_level: str