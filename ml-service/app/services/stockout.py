def calculate_stockout_days(
    current_stock: float,
    predicted_daily_demand: float,
) -> float:
    """
    Estimate how many days of stock remain
    based on predicted daily demand.
    """

    if current_stock < 0:
        raise ValueError("Current stock cannot be negative.")

    if predicted_daily_demand <= 0:
        return float("inf")

    return current_stock / predicted_daily_demand


def get_stockout_risk(days_remaining: float) -> str:
    """
    Convert estimated days of stock remaining
    into a simple risk level.
    """

    if days_remaining == float("inf"):
        return "LOW"

    if days_remaining < 3:
        return "CRITICAL"

    if days_remaining < 7:
        return "HIGH"

    if days_remaining <= 14:
        return "MEDIUM"

    return "LOW"