import csv
import random
from datetime import date, timedelta
from pathlib import Path

random.seed(42)

PHCS = [f"PHC{i:03d}" for i in range(1, 11)]

MEDICINES = {
    "MED001": {"name": "Paracetamol", "base_demand": 80},
    "MED002": {"name": "ORS", "base_demand": 60},
    "MED003": {"name": "Amoxicillin", "base_demand": 45},
    "MED004": {"name": "Ibuprofen", "base_demand": 50},
    "MED005": {"name": "Azithromycin", "base_demand": 35},
}

START_DATE = date(2025, 1, 1)
DAYS = 180

OUTPUT_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "sample"
    / "historical_demand.csv"
)


def generate_data():
    rows = []

    for phc in PHCS:
        phc_factor = random.uniform(0.7, 1.4)

        for medicine_id, medicine in MEDICINES.items():
            stock = random.randint(500, 1500)

            for day in range(DAYS):
                current_date = START_DATE + timedelta(days=day)

                weekly_factor = 1 + 0.15 * (
                    1 if current_date.weekday() >= 5 else 0
                )

                seasonal_factor = 1 + 0.10 * (
                    (day % 30) / 30
                )

                patient_footfall = max(
                    20,
                    int(
                        random.gauss(
                            100 * phc_factor * weekly_factor,
                            15
                        )
                    )
                )

                disease_cases = max(
                    5,
                    int(random.gauss(patient_footfall * 0.25, 5))
                )

                temperature = round(
                    random.uniform(20, 35),
                    1
                )

                demand = (
                    medicine["base_demand"]
                    * phc_factor
                    * weekly_factor
                    * seasonal_factor
                    * (patient_footfall / 100)
                )

                daily_consumption = max(
                    1,
                    int(random.gauss(demand, demand * 0.12))
                )

                stock = max(
                    0,
                    stock - daily_consumption
                )

                if stock < daily_consumption * 3:
                    stock += random.randint(300, 800)

                rows.append(
                    {
                        "date": current_date.isoformat(),
                        "phc_id": phc,
                        "medicine_id": medicine_id,
                        "stock": stock,
                        "daily_consumption": daily_consumption,
                        "patient_footfall": patient_footfall,
                        "temperature": temperature,
                        "disease_cases": disease_cases,
                    }
                )

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_PATH.open("w", newline="") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=rows[0].keys()
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"Generated {len(rows)} rows")
    print(f"Saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    generate_data()