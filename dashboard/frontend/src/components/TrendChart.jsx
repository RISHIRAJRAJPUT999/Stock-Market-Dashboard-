import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush,
  ReferenceLine
} from "recharts";

import {
  useEffect,
  useState
} from "react";

import API from "../services/api";

function TrendChart({
  selectedSymbol,
  timeframe
}) {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    API.get(
      `/history/${selectedSymbol}?range=${timeframe}`
    )
      .then((res) => {

        setData(res.data);

      })
      .catch((err) => {

        console.error(err);

      });

  }, [
    selectedSymbol,
    timeframe
  ]);

  const isPositive =
    data.length > 1 &&
    Number(
      data[data.length - 1].close
    ) >= Number(
      data[0].close
    );

  const lineColor =
    isPositive
      ? "#22c55e"
      : "#ef4444";

  return (

    <div className="chart-container">

      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px"
        }}
      >
        {selectedSymbol} - {
          timeframe === "1d"
            ? "Current Day Trend"
            : "7 Day Trend"
        }
      </h2>

      <ResponsiveContainer
        width="100%"
        height={400}
      >

        <LineChart
          data={data}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="market_timestamp"
            stroke="#94a3b8"
            minTickGap={80}
            interval="preserveStartEnd"
            tickFormatter={(value) => {

              const date =
                new Date(value);

              return timeframe === "1d"
                ? date.toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  )
                : date.toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short"
                    }
                  );

            }}
          />

          <YAxis
            domain={[
              (dataMin) =>
                dataMin -
                (
                  (
                    data.length
                      ? Math.max(
                          ...data.map(
                            d =>
                            Number(
                              d.close
                            )
                          )
                        )
                      : dataMin
                  ) -
                  dataMin
                ) * 0.10,

              (dataMax) =>
                dataMax +
                (
                  dataMax -
                  (
                    data.length
                      ? Math.min(
                          ...data.map(
                            d =>
                            Number(
                              d.close
                            )
                          )
                        )
                      : dataMax
                  )
                ) * 0.10
            ]}
            stroke="#94a3b8"
            tickFormatter={(value) =>
              `₹${Number(value)
                .toFixed(0)}`
            }
          />

          <Tooltip
            contentStyle={{
              backgroundColor:
                "#1e293b",
              border:
                "1px solid #334155",
              borderRadius:
                "10px",
              color: "#fff"
            }}
            labelFormatter={(value) => {

              const date =
                new Date(value);

              return timeframe === "1d"
                ? date.toLocaleTimeString(
                    "en-IN"
                  )
                : date.toLocaleString(
                    "en-IN"
                  );

            }}
            formatter={(value) => [
              `₹ ${Number(value)
                .toFixed(2)}`,
              "Close Price"
            ]}
          />

          {
            data.length > 0 && (
              <ReferenceLine
                y={
                  Number(
                    data[0].close
                  )
                }
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label="Open"
              />
            )
          }

          <Line
            type="monotone"
            dataKey="close"
            stroke={lineColor}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6
            }}
          />

          <Brush
            dataKey="market_timestamp"
            height={30}
            stroke="#2563eb"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}

export default TrendChart;