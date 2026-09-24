import pandas as pd

from app.services.baseline import add_baseline_prediction


DATA_PATH = "data/sample/historical_demand.csv"


def main():
    df = pd.read_csv(DATA_PATH)

    result = add_baseline_prediction(df)

    print(
        result[
            [
                "date",
                "phc_id",
                "medicine_id",
                "daily_consumption",
                "baseline_prediction",
            ]
        ].head(15).to_string(index=False)
    )


if __name__ == "__main__":
    main()