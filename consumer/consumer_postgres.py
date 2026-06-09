from kafka import KafkaConsumer
import psycopg2
import json
from datetime import datetime


conn = psycopg2.connect(
host="localhost",
database="stock_market_db",
user="postgres",
password="rishiraj"
)

cursor = conn.cursor()


consumer = KafkaConsumer(
"stock-data",
bootstrap_servers="localhost:9092",
value_deserializer=lambda x:
json.loads(x.decode("utf-8")),
auto_offset_reset="latest",
group_id="stock-consumer-group"
)


def cleanup_old_data():

    cursor.execute("""
        DELETE FROM stock_data
        WHERE market_timestamp <
        (
            NOW() - INTERVAL '7 days'
        )
    """)

    deleted_rows = cursor.rowcount

    conn.commit()

    if deleted_rows > 0:

        print(
            f"Cleanup: "
            f"{deleted_rows} old records deleted"
        )


print("=" * 60)
print("Kafka Consumer Started...")
print("=" * 60)

message_count = 0

for message in consumer:

    data = message.value

    try:

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
                %s,%s,%s,%s,%s,
                %s,%s,%s,%s
            )
            ON CONFLICT (
                symbol,
                market_timestamp
            )
            DO NOTHING
            """,
            (
                data["symbol"],
                data["asset_type"],

                data["open"],
                data["high"],
                data["low"],
                data["close"],

                data["volume"],

                datetime.strptime(
                    data["timestamp"],
                    "%Y-%m-%d %H:%M:%S"
                ),

                "Yahoo Finance"
            )
        )

        conn.commit()

        if cursor.rowcount > 0:

            print(
                f"Inserted -> "
                f"{data['symbol']} | "
                f"{data['close']}"
            )

        else:

            print(
                f"Duplicate Skipped -> "
                f"{data['symbol']}"
            )

        message_count += 1

    
        if message_count % 100 == 0:

            cleanup_old_data()

    except Exception as e:

        conn.rollback()

        print(
            f"Database Error for "
            f"{data['symbol']} : {e}"
        )
 
cursor.close()
conn.close()
