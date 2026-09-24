import json

from app.services.optimizer import optimize_redistribution


with open("data/sample/optimization_input.json", "r") as file:
    data = json.load(file)




result = optimize_redistribution(
    data["sources"],
    data["destinations"],
    data["distances"],
)

print("Redistribution plan:")
for shipment in result:
    print(shipment)