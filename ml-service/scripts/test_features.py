import pandas as pd

from app.preprocessing.features import create_features


DATA_PATH = "data/sample/historical_demand.csv"


def main():
    df = pd.read_csv(DATA_PATH)

    result = create_features(df)

    columns = [
        "date",
        "phc_id",
        "medicine_id",
        "daily_consumption",
        "lag_1",
        "lag_7",
        "rolling_mean_7",
        "patient_footfall",
        "disease_cases",
        "temperature",
    ]

    print(
        result[columns]
        .head(15)
        .to_string(index=False)
    )


if __name__ == "__main__":
    main()