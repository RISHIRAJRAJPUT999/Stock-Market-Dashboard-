import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="stock_market_db",
    user="postgres",
    password="rishiraj"
)

cursor = conn.cursor()

cursor.execute("""
DELETE FROM stock_data
WHERE market_timestamp <
(
    NOW() - INTERVAL '7 days'
);
""")

deleted_rows = cursor.rowcount

conn.commit()

cursor.close()
conn.close()

print(
    f"{deleted_rows} old records deleted"
)