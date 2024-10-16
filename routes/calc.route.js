const express = require("express");
const {
  calculateAndStoreYOYChange,
  calculateAndStoreMeanAndStdDev,
  calculateAndStoreCategoryTrends,
} = require("../controllers/calc.controller");
const { validateRequestQuery } = require("../middleware/validator");
const REQ_SCHEMA = require("../models/index.schema");
const router = express.Router();

router.get(
  "/threshold",
  validateRequestQuery(REQ_SCHEMA.CALC.calcForGivenCategory),
  calculateAndStoreMeanAndStdDev
);

router.get(
  "/yoyChange",
  validateRequestQuery(REQ_SCHEMA.CALC.calcForGivenCategory),
  calculateAndStoreYOYChange
);

router.get(
  "/categoryTrends",
  validateRequestQuery(REQ_SCHEMA.CALC.calcForGivenCategory),
  calculateAndStoreCategoryTrends
);

module.exports = router;
