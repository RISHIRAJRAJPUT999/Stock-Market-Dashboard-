import yfinance as yf
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="stock_market_db",
    user="postgres",
    password="rishiraj"
)

cursor = conn.cursor()

market_symbols = {
    "NIFTY50": "^NSEI",
    "BANKNIFTY": "^NSEBANK",
    "SENSEX": "^BSESN",
    "RELIANCE": "RELIANCE.NS",
    "TCS": "TCS.NS",
    "INFY": "INFY.NS",
    "HDFCBANK": "HDFCBANK.NS",
    "ICICIBANK": "ICICIBANK.NS",
    "SBIN": "SBIN.NS",
    "ITC": "ITC.NS",
    "LT": "LT.NS",
    "BHARTIARTL": "BHARTIARTL.NS",
    "ASIANPAINT": "ASIANPAINT.NS"
}

print("=" * 60)
print("Loading 7 Days Historical Data...")
print("=" * 60)

for symbol, ticker in market_symbols.items():

    try:

        print(f"\nFetching {symbol}...")

        df = yf.download(
            ticker,
            period="7d",
            interval="1m",
            progress=False,
            auto_adjust=False
        )

        if df.empty:
            print(f"No data found for {symbol}")
            continue

        if hasattr(df.columns, "levels"):
            df.columns = df.columns.get_level_values(0)

        asset_type = (
            "INDEX"
            if symbol in [
                "NIFTY50",
                "BANKNIFTY",
                "SENSEX"
            ]
            else "STOCK"
        )

        inserted = 0

        for timestamp, row in df.iterrows():

            cursor.execute(
                """
                INSERT INTO stock_data (
                    symbol,
                    asset_type,
                    open,
                    high,
                    low,
                    close,
                    volume,
                    market_timestamp,
                    source
                )
                VALUES (
                    %s,%s,%s,%s,%s,%s,%s,%s,%s
                )
                ON CONFLICT DO NOTHING
                """,
                (
                    symbol,
                    asset_type,
                    float(row["Open"]),
                    float(row["High"]),
                    float(row["Low"]),
                    float(row["Close"]),
                    int(row["Volume"]),
                    timestamp.to_pydatetime(),
                    "Yahoo Finance"
                )
            )

            inserted += cursor.rowcount

        conn.commit()

        print(
            f"{symbol}: {inserted} new records inserted"
        )

    except Exception as e:

        conn.rollback()

        print(
            f"Error loading {symbol}: {e}"
        )

cursor.close()
conn.close()

print("\n" + "=" * 60)
print("Historical Data Loading Completed")
print("=" * 60)