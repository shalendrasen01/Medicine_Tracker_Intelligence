import pandas as pd
from sklearn.metrics import mean_absolute_error

from app.services.baseline import add_baseline_prediction


DATA_PATH = "data/sample/historical_demand.csv"


def main():
    df = pd.read_csv(DATA_PATH)

    result = add_baseline_prediction(df)

    # Remove rows where there is not enough history
    result = result.dropna(subset=["baseline_prediction"])

    actual = result["daily_consumption"]
    predicted = result["baseline_prediction"]

    mae = mean_absolute_error(actual, predicted)

    print("\n--- BASELINE EVALUATION ---")
    print(f"Rows evaluated: {len(result)}")
    print(f"MAE: {mae:.2f}")


if __name__ == "__main__":
    main()