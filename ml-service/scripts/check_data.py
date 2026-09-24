import pandas as pd
from pathlib import Path

DATA_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "sample"
    / "historical_demand.csv"
)


def main():
    df = pd.read_csv(DATA_PATH)

    print("\n--- DATASET OVERVIEW ---")
    print(f"Rows: {len(df)}")
    print(f"Columns: {len(df.columns)}")

    print("\n--- COLUMNS ---")
    print(df.columns.tolist())

    print("\n--- DATE RANGE ---")
    print(f"Start: {df['date'].min()}")
    print(f"End:   {df['date'].max()}")

    print("\n--- UNIQUE VALUES ---")
    print(f"PHCs: {df['phc_id'].nunique()}")
    print(f"Medicines: {df['medicine_id'].nunique()}")

    print("\n--- MISSING VALUES ---")
    print(df.isnull().sum())

    print("\n--- DUPLICATES ---")
    print(f"Duplicate rows: {df.duplicated().sum()}")

    print("\n--- NUMERIC SUMMARY ---")
    print(
        df[
            [
                "stock",
                "daily_consumption",
                "patient_footfall",
                "temperature",
                "disease_cases",
            ]
        ].describe()
    )


if __name__ == "__main__":
    main()