from app.services.stockout import (
    calculate_stockout_days,
    get_stockout_risk,
)


def main():
    test_cases = [
        (500, 100),   # 5 days → HIGH
        (300, 30),    # 10 days → MEDIUM
        (500, 20),    # 25 days → LOW
        (100, 50),    # 2 days → CRITICAL
        (500, 0),     # infinite → LOW
    ]

    print("\n--- STOCK-OUT RISK TEST ---")

    for stock, demand in test_cases:
        days = calculate_stockout_days(
            stock,
            demand,
        )

        risk = get_stockout_risk(days)

        print(
            f"Stock: {stock:4} | "
            f"Demand/day: {demand:4} | "
            f"Days: {days} | "
            f"Risk: {risk}"
        )


if __name__ == "__main__":
    main()