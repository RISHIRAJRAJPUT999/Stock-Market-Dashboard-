import yfinance as yf
from kafka import KafkaProducer
import json
import time
from datetime import datetime
import pytz


producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)



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



def is_market_open():

    india = pytz.timezone(
        "Asia/Kolkata"
    )

    now = datetime.now(india)

    if now.weekday() >= 5:
        return False

    current_time = now.time()

    market_open = datetime.strptime(
        "09:15",
        "%H:%M"
    ).time()

    market_close = datetime.strptime(
        "15:30",
        "%H:%M"
    ).time()

    return (
        market_open <= current_time <= market_close
    )


print("=" * 60)
print("Yahoo Finance Kafka Producer Started")
print("=" * 60)

while True:

    try:

        india = pytz.timezone(
            "Asia/Kolkata"
        )

        now = datetime.now(india)



        if not is_market_open():

            print(
                f"\n[{now.strftime('%Y-%m-%d %H:%M:%S')}] "
                f"Market Closed"
            )

            print(
                "Waiting 1 Minutes...\n"
            )

            time.sleep(60)

            continue



        print(
            f"\n[{now.strftime('%Y-%m-%d %H:%M:%S')}] "
            f"Fetching Market Data..."
        )

        for symbol, ticker in market_symbols.items():

            try:

                stock = yf.Ticker(
                    ticker
                )

                data = stock.history(
                    period="1d",
                    interval="1m"
                )

                if data.empty:

                    print(
                        f"No data found for {symbol}"
                    )

                    continue

                latest = data.iloc[-1]

                market_time = latest.name

                message = {

                    "symbol": symbol,

                    "asset_type": (
                        "INDEX"
                        if symbol in [
                            "NIFTY50",
                            "BANKNIFTY",
                            "SENSEX"
                        ]
                        else "STOCK"
                    ),

                    "open": round(
                        float(latest["Open"]),
                        2
                    ),

                    "high": round(
                        float(latest["High"]),
                        2
                    ),

                    "low": round(
                        float(latest["Low"]),
                        2
                    ),

                    "close": round(
                        float(latest["Close"]),
                        2
                    ),

                    "volume": int(
                        latest["Volume"]
                    ),

                    "timestamp":
                    market_time.strftime(
                        "%Y-%m-%d %H:%M:%S"
                    )
                }

                producer.send(
                    "stock-data",
                    value=message
                )

                print(
                    f"Sent -> "
                    f"{symbol} | "
                    f"Close={message['close']} | "
                    f"Volume={message['volume']}"
                )

            except Exception as e:

                print(
                    f"Error fetching "
                    f"{symbol}: {e}"
                )

        producer.flush()

        print(
            "\nBatch Sent Successfully"
        )

        print(
            "Waiting 60 Seconds..."
        )

        time.sleep(60)

    except KeyboardInterrupt:

        print(
            "\nProducer Stopped"
        )

        producer.close()

        break

    except Exception as e:

        print(
            f"\nUnexpected Error: {e}"
        )

        time.sleep(60)