from app.services.demand_risk import get_demand_risk


tests = [
    (100, 50),
    (300, 50),
    (500, 50),
    (1000, 50),
]

for stock, demand in tests:
    risk = get_demand_risk(stock, demand)
    print(f"Stock: {stock}, Demand: {demand}, Risk: {risk}")