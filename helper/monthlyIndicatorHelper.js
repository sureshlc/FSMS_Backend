const { Sequelize, Model } = require("sequelize");
const { getKey } = require("./indicatorHelper");
const {
  getPercentageChange,
  handleUnitDisplay,
  handleValueUnits,
  getThresholds,
} = require("./calcHelper");
const IndicatorDetails = require("../models/entities/IndicatorDetails");

/**
 * Retrieves the monthly indicator query response based on the provided table model, indicator details, and optional query parameters.
 *
 * @param {Model} tableModel - The table model used for the query
 * @param {IndicatorDetails} indicatorDetails - Details of the indicator including column, items, and commodities
 * @param {Object} query - Optional query parameters
 * @return {Promise<Array>} Returns a promise that resolves to an array of query results
 */
const getMonthlyIndicatorQueryResponse = async (
  tableModel,
  indicatorDetails,
  query = {}
) => {
  let whereClause = {
    value: { [Sequelize.Op.not]: null },
    [indicatorDetails.column]: {
      [Sequelize.Op.or]: indicatorDetails.items.map((item) => ({
        [Sequelize.Op.iLike]: item,
      })),
    },
    absolute_year: {
      [Sequelize.Op.in]: ["2023", "2024"],
    },
  };

  // Include area filter only if provided
  if (query.area) {
    whereClause.area = { [Sequelize.Op.iLike]: query.area };
  }

  // adding commodities
  if (indicatorDetails.commodities && indicatorDetails.commodities.length > 0) {
    whereClause.item = {
      [Sequelize.Op.or]: indicatorDetails.commodities.map((item) => ({
        [Sequelize.Op.iLike]: item,
      })),
    };
  }

  const attributes = [
    [Sequelize.col(`${indicatorDetails.column}`), "indicator"],
    "year_month",
    [Sequelize.fn("SUM", Sequelize.col("value")), "value"],
    [Sequelize.fn("SUM", Sequelize.col("yearly_change")), "yearly_change"],
    "area",
  ];
  const group = ["area", `${indicatorDetails.column}`, "year_month"];

  // commodities
  if (indicatorDetails.commodities && indicatorDetails.commodities.length > 0) {
    attributes.push([Sequelize.col("item"), "commodity"]);
    group.push("item");
  }

  const sql_query = {
    attributes,
    where: whereClause,
    order: [["year_month", "DESC"]],
    group,
  };

  return await tableModel.findAll(sql_query);
};

/**
 * Process the monthly indicator response for each area and transform the grouped data.
 *
 * @param {object} groupedByArea - The data grouped by area
 * @param {IndicatorDetails} indicatorDetails - Details of the indicator
 * @return {Promise} A promise that resolves to an array of transformed records for each area
 */
const processMonthlyIndicatorResponse = async (
  groupedByArea,
  indicatorDetails
) => {
  // Transform grouped data
  const areaPromises = Object.entries(groupedByArea).map(
    async ([area, records]) => {
      const threshold = await getThresholds(area, indicatorDetails);
      const sortedRecords = records.sort((b, a) =>
        b.year_month.localeCompare(a.year_month)
      );

      const { year: latestYear, month: latestMonth } = getYearAndMonth(
        sortedRecords?.at(-1)?.year_month
      );

      const transformedRecords = sortedRecords.reduce((acc, result) => {
        const { year_month, indicator, value, commodity, yearly_change } =
          result;

        const { year, month } = getYearAndMonth(year_month);

        // Processing values with handleValueUnits
        const absValue = handleValueUnits(value, indicatorDetails.unit);
        const absYearlyChange = handleValueUnits(
          yearly_change,
          indicatorDetails.unit
        );

        if (!acc[year_month]) {
          acc[year_month] = {
            year: year,
            month: month,
          };
        }

        // Generate dynamic keys based on the indicator and commodity
        const valueKey = getKey(
          indicatorDetails,
          indicator,
          commodity,
          "value"
        );
        const monthlyChangeKey = getKey(
          indicatorDetails,
          indicator,
          commodity,
          "monthly_change"
        );

        acc[year_month][valueKey] = absValue;
        acc[year_month][monthlyChangeKey] = getPercentageChange(
          absYearlyChange,
          absValue,
          indicatorDetails.unit
        );

        return acc;
      }, {});

      return {
        area: area,
        is3YearAverage: indicatorDetails.is3YearAverage,
        unit: handleUnitDisplay(indicatorDetails.unit),
        latestYear,
        latestMonth,
        isPositive: indicatorDetails.isPositive,
        noOfDimensions: indicatorDetails.noOfDimensions,
        items:
          indicatorDetails?.legends?.length > 0
            ? indicatorDetails.legends
            : indicatorDetails.items,
        threshold,
        data: Object.values(transformedRecords),
      };
    }
  );

  return Promise.all(areaPromises);
};

/**
 * Splits the input yearMonth string into year and monthNumber, then converts the monthNumber into its corresponding month name.
 *
 * @private
 * @param {string} yearMonth - The input year and month in the format "YYYY-MM"
 * @return {Object} An object containing the year and the full name of the month
 */
const getYearAndMonth = (yearMonth) => {
  const [year, monthNumber] = yearMonth.split("-");
  const month = new Date(year, monthNumber - 1).toLocaleString("en-US", {
    month: "long",
  });
  return {
    year,
    month,
  };
};

/**
 * Checks whether indicator is monthly or not.
 *
 * @param {string} category - The category to check.
 * @param {string} [indicator=null] - The indicator to check.
 * @return {boolean} Whether the category is "FOOD_PRICE" and the indicator does not contain "producer price".
 */
const isMonthlyIndicator = (category, indicator = null) => {
  const isFoodPrice = category?.toUpperCase() === "FOOD_PRICE";
  if (!indicator) {
    return isFoodPrice;
  }
  return isFoodPrice && !/producer price/i.test(indicator);
};

module.exports = {
  processMonthlyIndicatorResponse,
  getMonthlyIndicatorQueryResponse,
  isMonthlyIndicator,
};
