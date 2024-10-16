const { Sequelize } = require("sequelize");
const DB_MODEL = require("../models/index.model");

/**
 * Retrieves trend data for a given alert.
 *
 * @param {object} alert - The alert object containing category and area information
 * @return {object} An object containing trend data, latest year, latest year change, and a flag indicating positive or negative change
 */
const getAlertTrends = async (alert) => {
  // query trend data
  const trendData = await DB_MODEL.CATEGORY_TRENDS.findAll({
    attributes: [
      "year",
      "value",
      "latest_year",
      "latest_year_change_percentage",
      "is_positive",
    ],
    where: {
      category_id: alert.category,
      area: alert.area,
    },
    order: [["year", "ASC"]],
  });

  // format trend data
  if (trendData.length === 0)
    return {
      latestYear: "2024",
      latestYearChange: 0,
      isGreen: null,
      trendData: [],
    };
  return {
    latestYear: trendData[0].latest_year,
    latestYearChange: trendData[0].latest_year_change_percentage,
    isGreen:
      trendData[0].is_positive ===
      trendData[0].latest_year_change_percentage > 0,
    trendData: trendData.map((t) => ({ year: t.year, value: t.value })),
  };
};

const customOrderForCategory = [
  "PRODUCTION_TRADE",
  "CONSUMPTION",
  "FOOD_PRICE",
  "FOOD_SECURITY",
];

// Building a CASE statement for custom order of categories
const categoryCaseStatement = Sequelize.literal(
  `CASE "category" ${customOrderForCategory
    .map((category, index) => `WHEN '${category}' THEN ${index}`)
    .join(" ")} ELSE ${customOrderForCategory.length} END`
);

module.exports = {
  getAlertTrends,
  categoryCaseStatement,
};
