import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SymbolBar from "./components/SymbolBar";
import StockDetails from "./components/StockDetails";
import TrendChart from "./components/TrendChart";
import AnalyticsPanel from "./components/AnalyticsPanel";

function App() {

  const [selectedSymbol, setSelectedSymbol] =
    useState("RELIANCE");

  const [timeframe, setTimeframe] =
    useState("1d");

  return (
    <div className="app-container">

      <Header />

      <SymbolBar
        selectedSymbol={selectedSymbol}
        setSelectedSymbol={setSelectedSymbol}
      />

      <div className="timeframe-bar">

        <button
          className={
            timeframe === "1d"
              ? "time-btn active"
              : "time-btn"
          }
          onClick={() =>
            setTimeframe("1d")
          }
        >
          Current Day
        </button>

        <button
          className={
            timeframe === "7d"
              ? "time-btn active"
              : "time-btn"
          }
          onClick={() =>
            setTimeframe("7d")
          }
        >
          Last 7 Days
        </button>

      </div>

      <StockDetails
        selectedSymbol={selectedSymbol}
        timeframe={timeframe}
      />

      <TrendChart
        selectedSymbol={selectedSymbol}
        timeframe={timeframe}
      />

      <AnalyticsPanel
        selectedSymbol={selectedSymbol}
        timeframe={timeframe}
      />

    </div>
  );
}

export default App;