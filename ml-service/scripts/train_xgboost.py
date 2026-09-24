import pandas as pd
import joblib

from pathlib import Path
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error


DATA_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "processed"
    / "training_data.csv"
)

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

TARGET_COLUMN = "daily_consumption"


def main():
    df = pd.read_csv(DATA_PATH)

    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")

    split_date = pd.Timestamp("2025-06-01")

    train = df[df["date"] < split_date]
    test = df[df["date"] >= split_date]

    X_train = train[FEATURE_COLUMNS]
    y_train = train[TARGET_COLUMN]

    X_test = test[FEATURE_COLUMNS]
    y_test = test[TARGET_COLUMN]

    model = XGBRegressor(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="reg:squarederror",
        random_state=42,
    )

    print("Training XGBoost model...")

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    print("\n--- XGBOOST EVALUATION ---")
    print(f"Training rows: {len(train)}")
    print(f"Test rows: {len(test)}")
    print(f"MAE: {mae:.2f}")

    print("\n--- BASELINE COMPARISON ---")
    print("Baseline MAE: 13.20")
    print(f"XGBoost MAE:  {mae:.2f}")

    if mae < 13.20:
        print("XGBoost improved over baseline.")
    else:
        print("XGBoost did not beat the baseline.")

    MODEL_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    joblib.dump(model, MODEL_PATH)

    print(f"\nModel saved to: {MODEL_PATH}")


if __name__ == "__main__":
    main()