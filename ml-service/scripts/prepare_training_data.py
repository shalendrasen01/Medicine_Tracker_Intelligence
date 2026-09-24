import pandas as pd
from pathlib import Path

from app.preprocessing.features import create_features


INPUT_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "sample"
    / "historical_demand.csv"
)

OUTPUT_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "processed"
    / "training_data.csv"
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

TARGET_COLUMN = "daily_consumption"


def main():
    df = pd.read_csv(INPUT_PATH)

    df = create_features(df)

    # Remove rows where historical features are not available.
    df = df.dropna(
        subset=[
            "lag_1",
            "lag_7",
            "rolling_mean_7",
        ]
    )

    training_data = df[
        [
            "date",
            "phc_id",
            "medicine_id",
            *FEATURE_COLUMNS,
            TARGET_COLUMN,
        ]
    ]

    OUTPUT_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    training_data.to_csv(
        OUTPUT_PATH,
        index=False,
    )

    print(f"Training rows: {len(training_data)}")
    print(f"Features: {FEATURE_COLUMNS}")
    print(f"Target: {TARGET_COLUMN}")
    print(f"Saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()