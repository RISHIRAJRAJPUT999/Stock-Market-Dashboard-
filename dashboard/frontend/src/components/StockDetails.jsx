import { useEffect, useState } from "react";
import API from "../services/api";

function StockDetails({
  selectedSymbol,
  timeframe
}) {

  const [stock, setStock] =
    useState(null);

  useEffect(() => {

    API.get(
      `/summary/${selectedSymbol}?range=${timeframe}`
    )
      .then((res) => {

        setStock(res.data);

      })
      .catch((err) => {

        console.error(err);

      });

  }, [selectedSymbol, timeframe]);

  if (!stock) {
    return <h3>Loading...</h3>;
  }

  return (

    <div>

      <h2
        style={{
          textAlign: "center",
          marginTop: "20px"
        }}
      >
        {selectedSymbol}
      </h2>

      <h3
        style={{
          textAlign: "center",
          color: "#94a3b8",
          marginBottom: "20px"
        }}
      >
        {
          timeframe === "1d"
            ? "Current Day Summary"
            : "7 Day Summary"
        }
      </h3>

      <div className="details-grid">

        <div className="card">
          <div className="card-title">
            OPEN
          </div>
          <div className="card-value">
            ₹ {Number(stock.open).toFixed(2)}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            HIGH
          </div>
          <div className="card-value">
            ₹ {Number(stock.high).toFixed(2)}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            LOW
          </div>
          <div className="card-value">
            ₹ {Number(stock.low).toFixed(2)}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            CLOSE
          </div>
          <div className="card-value">
            ₹ {Number(stock.close).toFixed(2)}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            VOLUME
          </div>
          <div className="card-value">
            {
              stock.volume === 0
                ? "N/A"
                : Number(
                    stock.volume
                  ).toLocaleString()
            }
          </div>
        </div>

      </div>

    </div>

  );

}

export default StockDetails;