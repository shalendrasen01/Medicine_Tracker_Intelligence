from app.services.stockout import (
    calculate_stockout_days,
    get_stockout_risk,
)


def get_demand_risk(
    current_stock: float,
    predicted_daily_demand: float,
) -> str:
    days_remaining = calculate_stockout_days(
        current_stock,
        predicted_daily_demand,
    )

    return get_stockout_risk(days_remaining)