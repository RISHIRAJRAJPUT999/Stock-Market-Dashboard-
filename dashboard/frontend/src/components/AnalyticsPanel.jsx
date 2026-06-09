import { useEffect, useState } from "react";
import API from "../services/api";

function AnalyticsPanel({
  selectedSymbol,
  timeframe
}) {

  const [analytics, setAnalytics] =
    useState(null);

  useEffect(() => {

    API.get(
      `/analytics/${selectedSymbol}?range=${timeframe}`
    )
      .then((res) => {

        setAnalytics(res.data);

      })
      .catch((err) => {

        console.error(err);

      });

  }, [selectedSymbol, timeframe]);

  if (!analytics) {
    return <h3>Loading...</h3>;
  }

  return (

    <div>

      <h2
        style={{
          textAlign: "center",
          marginTop: "30px"
        }}
      >
        {
          timeframe === "1d"
            ? "Current Day Analytics"
            : "7 Day Analytics"
        }
      </h2>

      <div className="analytics-grid">

        <div className="card">

          <div className="card-title">
            Return %
          </div>

          <div
            className="card-value"
            style={{
              color:
                Number(
                  analytics.return_pct
                ) >= 0
                  ? "#22c55e"
                  : "#ef4444"
            }}
          >
            {analytics.return_pct}%
          </div>

        </div>

        <div className="card">

          <div className="card-title">
            Moving Average
          </div>

          <div className="card-value">
            ₹ {
              Number(
                analytics.moving_average
              ).toFixed(2)
            }
          </div>

        </div>

        <div className="card">

          <div className="card-title">
            Volatility
          </div>

          <div className="card-value">
            {
              Number(
                analytics.volatility
              ).toFixed(2)
            }
          </div>

        </div>

        <div className="card">

          <div className="card-title">
            Sentiment
          </div>

          <div
            className="card-value"
            style={{
              color:
                analytics.sentiment ===
                "Bullish"
                  ? "#22c55e"
                  : analytics.sentiment ===
                    "Bearish"
                  ? "#ef4444"
                  : "#facc15"
            }}
          >
            {analytics.sentiment}
          </div>

        </div>

      </div>

    </div>

  );

}

export default AnalyticsPanel;