const express = require("express");

const {
  getStockHistory,
  getStockSummary,
  getAnalytics,
  getLastUpdate
} = require("../controllers/stockController");

const router = express.Router();
router.get(
  "/summary/:symbol",
  getStockSummary
);
router.get(
  "/history/:symbol",
  getStockHistory
);
router.get(
  "/analytics/:symbol",
  getAnalytics
);
router.get(
  "/last-update",
  getLastUpdate
);

module.exports = router;