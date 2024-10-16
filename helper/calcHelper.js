const { Sequelize } = require("sequelize");
const DB_MODEL = require("../models/index.model");
const { CURRENT_YEAR } = require("../constants");

/**
 * Calculate the percentage change based on the given change, value, and unit.
 *
 * @param {number} change - the amount of change
 * @param {number} value - the original value
 * @param {string} unit - the unit of measurement
 * @return {number} the calculated percentage change
 */
const getPercentageChange = (change, value, unit) => {
  if (unit === "%" || /percent/i.test(unit) || /\%/.test(unit)) {
    return change;
  }
  return (
    parseFloat(((change / Math.abs(value - change)) * 100).toFixed(2)) || 0
  );
};

/**
 * Handles the value and unit to convert the value to the correct unit.
 *
 * @param {number} value - the value to be converted
 * @param {string} unit - the unit to be used for conversion
 * @return {number|null} the converted value or null if the value is not valid
 */
const handleValueUnits = (value, unit) => {
  if (/^-/i.test(unit)) {
    return parseFloat(value?.toFixed(2)) || null;
  }
  if (/^1000/i.test(unit)) {
    return value * 1000;
  }
  if (/^million/i.test(unit)) {
    return value * 1000000;
  }
  if (/^100/i.test(unit)) {
    return value * 100;
  }
  return parseFloat(value?.toFixed(2)) || null;
};

/**
 * Handles the display unit post processing
 *
 * @param {string} unit - the unit
 * @return {string} display unit
 */
const handleUnitDisplay = (unit) => {
  if (/^-/i.test(unit)) {
    return unit.replace(/-/i, "").trim();
  }
  if (/^million/i.test(unit)) {
    return unit.replace(/million/i, "").trim();
  }
  if (/^1000/i.test(unit)) {
    return unit.replace(/1000/i, "").trim();
  }
  if (/^100/i.test(unit)) {
    return unit.replace(/100/i, "").trim();
  }
  return unit;
};

function getYearRange(sort = 1, fromYear = "2018", forecast = 0) {
  const endYear = new Date().getFullYear() + forecast;
  let years = [];
  // If fromYear is provided
  for (let year = fromYear; year <= endYear; year++) {
    years.push(year.toString());
  }
  return sort === 1 ? years : years.reverse();
}

/**
 * Compares the given year with the latest year and current year to determine if it is a forecast year.
 *
 * @param {number} latestYear - The latest year for comparison
 * @param {number} currentYear - The year to compare
 * @param {boolean} isForecast - Indicates if the current year is a forecast
 * @return {boolean}
 */
const compareYear = (latestYear, currentYear, isForecast = false) => {
  return (
    currentYear == CURRENT_YEAR || (currentYear > latestYear && !isForecast)
  );
};

/**
 * Compares the given year and month with the latest year
 *
 * @param {string} latestYear - The latest year to compare against.
 * @param {string} yearMonth - The year and month to compare.
 * @return {boolean}
 */
const compareMonth = (latestYear, yearMonth) => {
  return yearMonth.localeCompare(latestYear) > 0;
};

/**
 * Asynchronously retrieves thresholds from the database based on the provided area and indicator details.
 *
 * @param {string} area - The area for which thresholds are being retrieved.
 * @param {object} indicatorDetails - The details of the indicator, including column, threshold display, items, commodities, and unit.
 * @return {Promise<Array>} An array of threshold values retrieved from the database.
 */
async function getThresholds(area, indicatorDetails) {
  try {
    const columnName = indicatorDetails.column;
    // Create where clause
    const whereClause = {};
    whereClause["area"] =
      indicatorDetails.thresholdDisplay === "ALL"
        ? "ALL MASHREQ COUNTRIES" // If "ALL" is required
        : { [Sequelize.Op.iLike]: area }; // For partial matching with LIKE

    whereClause[columnName] =
      indicatorDetails.items.length === 1
        ? { [Sequelize.Op.iLike]: indicatorDetails.items[0] } // Single item with LIKE
        : {
            [Sequelize.Op.or]: indicatorDetails.items.map((item) => ({
              [Sequelize.Op.iLike]: item,
            })),
          };

    if (indicatorDetails.commodities) {
      whereClause["item"] = {
        [Sequelize.Op.or]: indicatorDetails.commodities.map((item) => ({
          [Sequelize.Op.iLike]: item,
        })),
      };
    } else {
      if (columnName !== "item") {
        whereClause["item"] = "ALL ITEMS";
      }
    }

    // Fetch thresholds from the database
    const results = await DB_MODEL.THRESHOLD.findAll({
      where: whereClause,
    });

    if (results.length === 0) {
      return [];
    }

    // Process the results based on thresholdDisplay and items length
    return results
      .map((result) => {
        const mean = handleValueUnits(result.mean_value, indicatorDetails.unit);
        const stdDev = handleValueUnits(
          result.standard_deviation,
          indicatorDetails.unit
        );
        if (
          indicatorDetails?.items?.length > 1 ||
          indicatorDetails?.commodities?.length > 1
        ) {
          return parseFloat(mean.toFixed(2));
        }
        return [
          Math.abs(parseFloat((mean - stdDev).toFixed(2))),
          parseFloat((mean + stdDev).toFixed(2)),
        ];
      })
      .flat();
  } catch (error) {
    console.error("Error in getThresholds:", error);
    return [];
  }
}

module.exports = {
  getPercentageChange,
  handleValueUnits,
  handleUnitDisplay,
  getThresholds,
  getYearRange,
  compareYear,
  compareMonth,
};
