def get_demand_risk(
    current_stock: float,
    predicted_daily_demand: float,
) -> str:
    if predicted_daily_demand <= 0:
        return "LOW"

    days_remaining = current_stock / predicted_daily_demand

    if days_remaining < 3:
        return "CRITICAL"
    if days_remaining < 7:
        return "HIGH"
    if days_remaining <= 14:
        return "MEDIUM"

    return "LOW"