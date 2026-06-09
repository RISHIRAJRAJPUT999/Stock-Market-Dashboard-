const pool = require("../config/db");


const getStockHistory = async (req, res) => {

try {

 const { symbol } = req.params;

const range =
  req.query.range || "1d";

let query;

if (range === "1d") {

  query = `
    SELECT
      close,
      volume,
      market_timestamp
    FROM stock_data
    WHERE symbol = $1
    AND DATE(market_timestamp) =
    (
      SELECT DATE(MAX(market_timestamp))
      FROM stock_data
    )
    ORDER BY market_timestamp ASC
  `;

} else {

  query = `
    SELECT
      close,
      volume,
      market_timestamp
    FROM stock_data
    WHERE symbol = $1
    ORDER BY market_timestamp ASC
  `;

}

const result =
  await pool.query(
    query,
    [symbol]
  );

res.status(200).json(
  result.rows
);
 
} catch (error) {

 console.error(error);

res.status(500).json({
  message: "Server Error"
});
 
}

};



const getStockSummary  = async (req, res) => {

try {

const { symbol } = req.params;

const range =
  req.query.range || "1d";

let query;

if (range === "1d") {

  query = `
    SELECT

    (
      SELECT open
      FROM stock_data
      WHERE symbol = $1
      AND DATE(market_timestamp) =
      (
        SELECT DATE(MAX(market_timestamp))
        FROM stock_data
      )
      ORDER BY market_timestamp ASC
      LIMIT 1
    ) AS open,

    MAX(high) AS high,

    MIN(low) AS low,

    (
      SELECT close
      FROM stock_data
      WHERE symbol = $1
      AND DATE(market_timestamp) =
      (
        SELECT DATE(MAX(market_timestamp))
        FROM stock_data
      )
      ORDER BY market_timestamp DESC
      LIMIT 1
    ) AS close,

    SUM(volume) AS volume

    FROM stock_data
    WHERE symbol = $1
    AND DATE(market_timestamp) =
    (
      SELECT DATE(MAX(market_timestamp))
      FROM stock_data
    )
  `;

} else {

  query = `
    SELECT

    (
      SELECT open
      FROM stock_data
      WHERE symbol = $1
      ORDER BY market_timestamp ASC
      LIMIT 1
    ) AS open,

    MAX(high) AS high,

    MIN(low) AS low,

    (
      SELECT close
      FROM stock_data
      WHERE symbol = $1
      ORDER BY market_timestamp DESC
      LIMIT 1
    ) AS close,

    SUM(volume) AS volume

    FROM stock_data
    WHERE symbol = $1
  `;

}

const result =
  await pool.query(
    query,
    [symbol]
  );

res.status(200).json(
  result.rows[0]
);
 
} catch (error) {

 console.error(error);

res.status(500).json({
  message: "Server Error"
});
 
}

};



const getAnalytics = async (req, res) => {

try {

 
const { symbol } = req.params;

const range =
  req.query.range || "1d";

let query;

if (range === "1d") {

  query = `
    SELECT
    close
    FROM stock_data
    WHERE symbol = $1
    AND DATE(market_timestamp) =
    (
      SELECT DATE(MAX(market_timestamp))
      FROM stock_data
    )
    ORDER BY market_timestamp ASC
  `;

} else {

  query = `
    SELECT
    close
    FROM stock_data
    WHERE symbol = $1
    ORDER BY market_timestamp ASC
  `;

}

const result =
  await pool.query(
    query,
    [symbol]
  );

const rows =
  result.rows;

if (!rows.length) {

  return res.status(404).json({
    message:
    "No Data Found"
  });

}

const closes =
  rows.map(
    row =>
    Number(row.close)
  );

const firstClose =
  closes[0];

const lastClose =
  closes[
    closes.length - 1
  ];

const returnPct =
  (
    (
      lastClose -
      firstClose
    ) /
    firstClose
  ) * 100;

const movingAverage =
  closes.reduce(
    (a, b) => a + b,
    0
  ) / closes.length;

const mean =
  movingAverage;

const variance =
  closes.reduce(
    (a, b) =>
      a +
      Math.pow(
        b - mean,
        2
      ),
    0
  ) / closes.length;

const volatility =
  Math.sqrt(
    variance
  );

let sentiment =
  "Neutral";

if (
  returnPct > 2
) {
  sentiment =
    "Bullish";
}

if (
  returnPct < -2
) {
  sentiment =
    "Bearish";
}

res.status(200).json({

  return_pct:
  returnPct.toFixed(2),

  moving_average:
  movingAverage.toFixed(2),

  volatility:
  volatility.toFixed(2),

  sentiment

});
 

} catch (error) {

 
console.error(error);

res.status(500).json({
  message:
  "Server Error"
});
 

}

};



const getLastUpdate = async (req, res) => {

try {
 
const query = `
  SELECT
  MAX(market_timestamp)
  AS last_update
  FROM stock_data
`;

const result =
  await pool.query(
    query
  );

res.status(200).json(
  result.rows[0]
);
 

} catch (error) {
 
console.error(error);

res.status(500).json({
  message:
  "Server Error"
});
 

}

};

module.exports = {
  getStockHistory,
  getStockSummary,
  getAnalytics,
  getLastUpdate
};
