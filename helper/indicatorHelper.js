const { Sequelize, Model } = require("sequelize");
const {
  getPercentageChange,
  handleUnitDisplay,
  handleValueUnits,
  getThresholds,
  compareYear,
  getYearRange,
} = require("./calcHelper");
const { QUERY_SORT_ASC } = require("../constants");
const IndicatorDetails = require("../models/entities/IndicatorDetails");

/**
 * Retrieves response based on the provided table, indicator details, and query.
 *
 * @param {Model} table - The name of the table to retrieve data from.
 * @param {IndicatorDetails} indicatorDetails
 * @param {object} query - Additional query parameters for data retrieval.
 * @return {Promise} A promise that resolves with the response data.
 */
const getIndicatorQueryResponse = async (table, indicatorDetails, query) => {
  let whereClause = {
    value: { [Sequelize.Op.not]: null },
    [indicatorDetails.column]: {
      [Sequelize.Op.or]: indicatorDetails.items.map((item) => ({
        [Sequelize.Op.iLike]: item,
      })),
    },
    absolute_year: {
      [Sequelize.Op.in]: getYearRange(
        query.sort,
        query.fromYear,
        query.forecast
      ),
    },
    ...(query.area && { area: { [Sequelize.Op.iLike]: query.area } }),
    ...(!query.forecast && { is_forecast: false }),
  };

  const attributes = [
    [Sequelize.col(`${indicatorDetails.column}`), "indicator"],
    "area",
    "year",
    "absolute_year",
    [Sequelize.fn("SUM", Sequelize.col("value")), "value"],
    "unit",
    [Sequelize.fn("SUM", Sequelize.col("yearly_change")), "yearly_change"],
    "is_forecast",
  ];
  // groups
  const group = [
    "area",
    `${indicatorDetails.column}`,
    "year",
    "absolute_year",
    "unit",
    "is_forecast",
  ];

  // updating query incase of commodities
  if (indicatorDetails.commodities && indicatorDetails.commodities.length > 0) {
    if (
      indicatorDetails.name === "fertilizers - import/export" ||
      indicatorDetails.name === "fertilizers"
    ) {
      whereClause.element = {
        [Sequelize.Op.or]: indicatorDetails.commodities.map((item) => ({
          [Sequelize.Op.iLike]: item,
        })),
      };
      attributes.push([Sequelize.col("element"), "commodity"]);
      group.push("element");
    } else {
      whereClause.item = {
        [Sequelize.Op.or]: indicatorDetails.commodities.map((item) => ({
          [Sequelize.Op.iLike]: item,
        })),
      };
      attributes.push([Sequelize.col("item"), "commodity"]);
      group.push("item");
    }
  }

  const sql_query = {
    attributes,
    where: whereClause,
    order: [["absolute_year", query.sort === QUERY_SORT_ASC ? "DESC" : "ASC"]],
    group,
  };
  // Execute the query
  return await table.findAll(sql_query);
};

/**
 * Process each area's data and gather results
 *
 * @param {Object} groupedByArea - The data grouped by area
 * @param {Object} indicatorDetails
 * @return {Promise} A promise that resolves to an array of processed area results
 */
const processIndicatorResponse = async (groupedByArea, indicatorDetails) => {
  // Process each area's data and gather results
  const areaPromises = Object.entries(groupedByArea).map(
    async ([area, records]) => {
      const threshold = await getThresholds(area, indicatorDetails);

      const { data, latestYear, latestYearChange } = processDataForArea(
        records,
        indicatorDetails
      );

      const isGreen = indicatorDetails.isPositive === latestYearChange > 0;

      return {
        area,
        is3YearAverage: indicatorDetails.is3YearAverage,
        unit: handleUnitDisplay(indicatorDetails.unit),
        latestYear,
        latestYearChange,
        isPositive: indicatorDetails.isPositive,
        isGreen, //TODO: move to UI,
        is2dData: indicatorDetails.is2dData, //TODO: remove entirely
        noOfDimensions: indicatorDetails.noOfDimensions,
        items:
          indicatorDetails?.legends?.length > 0
            ? indicatorDetails.legends
            : indicatorDetails.items,
        threshold,
        data,
      };
    }
  );

  return Promise.all(areaPromises);
};

/**
 * Process and group the records for a specific area based on the provided indicator details.
 *
 * @private
 * @param {Array} records - The records to be processed
 * @param {IndicatorDetails} indicatorDetailsused for processing
 * @return {Object} The processed data along with the latest year and its change
 */
function processDataForArea(records, indicatorDetails) {
  let latestYear;
  let latestYearlyChange = 0;
  let latestYearValue = 0;

  const groupedData = records.reduce((acc, result) => {
    const {
      year,
      absolute_year,
      indicator,
      value,
      commodity,
      yearly_change,
      is_forecast,
      color,
    } = result;

    const yearKey = indicatorDetails.is3YearAverage ? year : absolute_year;

    // get absolute values
    const absValue = handleValueUnits(value, indicatorDetails.unit);
    const absYearlyChange = handleValueUnits(
      yearly_change,
      indicatorDetails.unit
    );

    // Track the latest year
    if (!latestYear || compareYear(latestYear, yearKey, is_forecast)) {
      latestYear = yearKey;
      latestYearlyChange = absYearlyChange;
    }

    // Initialize data structure for each year
    if (!acc[yearKey]) {
      acc[yearKey] = {
        year: yearKey,
        isForecast: yearKey >= new Date().getFullYear(),
        color: color,
      };
    }

    const key = getKey(indicatorDetails, indicator, commodity, "value");
    const changeKey = getKey(
      indicatorDetails,
      indicator,
      commodity,
      "yearly_change"
    );

    acc[yearKey][key] = absValue;
    acc[yearKey][changeKey] = getPercentageChange(
      absYearlyChange,
      absValue,
      indicatorDetails.unit
    );

    // Calculate total change for the latest year
    if (yearKey === latestYear) {
      latestYearValue += absValue;
    }

    return acc;
  }, {});

  const latestYearChange = getPercentageChange(
    latestYearlyChange,
    latestYearValue,
    indicatorDetails.unit
  );

  return {
    data: Object.values(groupedData),
    latestYear,
    latestYearChange,
  };
}

/**
 * Generate a key based on indicator or commodity and a prefix
 *
 * @param {IndicatorDetails} indicatorDetails
 * @param {string} indicator - the indicator
 * @param {string} commodity - the commodity
 * @param {string} prefix - the prefix for the key
 * @return {string} the generated key
 */
function getKey(indicatorDetails, indicator, commodity, prefix) {
  if (indicatorDetails.noOfDimensions === 1) {
    return `${prefix}`;
  }
  // Generate a key based on indicator or commodity and a prefix
  const index =
    indicatorDetails.commodities?.length >= indicatorDetails.items?.length
      ? elementIndexOf(indicatorDetails.commodities, commodity)
      : elementIndexOf(indicatorDetails.items, indicator);

  return `${prefix}${index}`;
}

/**
 * Find the index of the searchElement in the array, ignoring case.
 *
 * @private
 * @param {Array} array - The input array
 * @param {string} searchElement - The element to search for
 * @return {number|string} The index of the searchElement, or an empty string if not found
 */
function elementIndexOf(array, searchElement) {
  const lowercasedElement = searchElement?.toLowerCase();
  for (let i = 0; i < array.length; i++) {
    if (array[i].toLowerCase() === lowercasedElement) {
      return i;
    }
  }
  return "";
}

module.exports = {
  getIndicatorQueryResponse,
  processIndicatorResponse,
  getKey,
};
