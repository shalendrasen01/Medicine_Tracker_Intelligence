import pandas as pd


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["date"] = pd.to_datetime(
        df["date"],
        dayfirst=True
    )

    df = df.sort_values(
        ["phc_id", "medicine_id", "date"]
    )

    # Calendar features
    df["day_of_week"] = df["date"].dt.dayofweek
    df["month"] = df["date"].dt.month

    # Historical consumption features
    grouped = df.groupby(
        ["phc_id", "medicine_id"]
    )["daily_consumption"]

    df["lag_1"] = grouped.shift(1)
    df["lag_7"] = grouped.shift(7)

    df["rolling_mean_7"] = grouped.transform(
        lambda x: x.shift(1).rolling(7).mean()
    )

    return df


#shift(1): very important for avoiding data leakage. For eg: while predicting for jan 10, we should not use jan 10 consumption for prediction