import joblib

from pathlib import Path


MODEL_PATH = (
    Path(__file__).resolve().parent.parent
    / "models"
    / "demand_xgboost.pkl"
)


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


def main():
    model = joblib.load(MODEL_PATH)

    importances = model.feature_importances_

    results = sorted(
        zip(FEATURE_COLUMNS, importances),
        key=lambda x: x[1],
        reverse=True,
    )

    print("\n--- FEATURE IMPORTANCE ---")

    for feature, importance in results:
        print(
            f"{feature:20s} {importance:.4f}"
        )


if __name__ == "__main__":
    main()