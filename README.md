# Real-Time Stock Market Dashboard 📈

A robust, real-time data pipeline and visualization dashboard for Indian stock market indices and equities. This project utilizes a modern data engineering stack to fetch, stream, store, and visualize live market data.

## 🏗️ Architecture

The system is built with a distributed architecture:

1.  **Data Ingestion (Producer):** A Python script that fetches real-time 1-minute interval data from Yahoo Finance and produces it to a Kafka topic.
2.  **Streaming (Kafka):** Acts as the message broker, handling the flow of data between the producer and the consumer.
3.  **Data Processing (Consumer):** A Python script that consumes data from Kafka, processes it, and stores it in a PostgreSQL database with automatic 7-day data retention.
4.  **Backend API (Node.js/Express):** Serves as the data layer, providing RESTful endpoints for the dashboard to fetch historical data, summaries, and technical analytics.
5.  **Frontend Dashboard (React):** A modern, interactive UI that displays price trends, volume, and technical indicators (Volatility, Moving Averages, Sentiment).

## 🛠️ Tech Stack

-   **Language:** Python, JavaScript (Node.js, React)
-   **Streaming:** Apache Kafka
-   **Database:** PostgreSQL
-   **API:** Express.js
-   **Frontend:** React.js, Vite, Axios, CSS3
-   **Data Source:** Yahoo Finance API (`yfinance`)

## 🚀 Getting Started

### Prerequisites

-   Python 3.x
-   Node.js & npm
-   Apache Kafka & Zookeeper
-   PostgreSQL

### 1. Database Setup

1.  Create a PostgreSQL database named `stock_market_db`.
2.  Create the `stock_data` table:
    ```sql
    CREATE TABLE stock_data (
        id SERIAL PRIMARY KEY,
        symbol VARCHAR(20),
        asset_type VARCHAR(10),
        open DECIMAL(15, 2),
        high DECIMAL(15, 2),
        low DECIMAL(15, 2),
        close DECIMAL(15, 2),
        volume BIGINT,
        market_timestamp TIMESTAMP,
        source VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (symbol, market_timestamp)
    );
    ```

### 2. Kafka Setup

1.  Start Zookeeper.
2.  Start Kafka Broker.
3.  Create the topic:
    ```bash
    kafka-topics.sh --create --topic stock-data --bootstrap-server localhost:9092
    ```

### 3. Backend Setup

1.  Navigate to `dashboard/backend`.
2.  Install dependencies: `npm install`.
3.  Configure your `.env` file with database credentials.
4.  Start the server: `npm start`.

### 4. Frontend Setup

1.  Navigate to `dashboard/frontend`.
2.  Install dependencies: `npm install`.
3.  Start the development server: `npm run dev`.

### 5. Running the Pipeline

1.  **Historical Data (Optional):** Run `python database/load_historical_data.py` to pre-fill the last 7 days of data.
2.  **Consumer:** Run `python consumer/consumer_postgres.py`.
3.  **Producer:** Run `python producer/yahoo_kafka_producer.py`.

## 📊 Features

-   **Real-time Tracking:** Live 1-minute updates for NIFTY50, BANKNIFTY, SENSEX, and major Indian stocks.
-   **Technical Analytics:** Automatic calculation of Moving Averages, Volatility, and Market Sentiment.
-   **Smart Storage:** Built-in cleanup logic that keeps only the last 7 days of data to maintain performance.
-   **Historical View:** Toggle between current day and weekly views.

## 📝 License

This project is open-source and available under the MIT License.
