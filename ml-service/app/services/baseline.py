import pandas as pd


def add_baseline_prediction(
    df: pd.DataFrame,
    window: int = 7,
) -> pd.DataFrame:
    """
    Predict demand using the average consumption
    from the previous `window` days.
    """

    df = df.copy()

    df["date"] = pd.to_datetime(
        df["date"],
        dayfirst=True
    )

    df = df.sort_values(
        ["phc_id", "medicine_id", "date"]
    )

    df["baseline_prediction"] = (
        df.groupby(["phc_id", "medicine_id"])["daily_consumption"]
        .transform(
            lambda x: x.shift(1).rolling(window).mean()
        )
    )

    return df