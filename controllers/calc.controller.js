const RESPONSE = require("../common/response");
const DB_MODEL = require("../models/index.model");
const CONST_UTILS = require("../utils/constantUtils");
const { getCategoryAndIndicatorDetails } = require("../utils/categoryUtils");
const { sq } = require("../configuration/db.config");
const { getIndicatorQueryResponse } = require("../helper/indicatorHelper");
const { dbBulkCreate } = require("../services/dbService");
const {
  getMonthlyIndicatorQueryResponse,
  isMonthlyIndicator,
} = require("../helper/monthlyIndicatorHelper");
const {
  getPercentageChange,
  compareMonth,
  compareYear,
} = require("../helper/calcHelper");
const logger = require("../common/logger");

/**
 * Calculate and store year-on-year change values in the db for the specified category.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise<void>} a Promise that resolves once the calculation and storage are complete
 */
exports.calculateAndStoreYOYChange = async (req, res) => {
  try {
    const query = req.query;
    const categoryKey = query.category.toUpperCase();
    const tableModel = CONST_UTILS.TABLE_MODEL(categoryKey);
    const tableName = tableModel.getTableName();

    // Step 1: Create a temporary table with year-on-year change
    // Cast the value to numeric type before rounding
    await sq.query(`
      CREATE TEMPORARY TABLE temp_${tableName} AS
      SELECT id, area, element, item, value, absolute_year, ${
        isMonthlyIndicator(categoryKey) ? "year_month," : ""
      }
             COALESCE(
               ROUND((value::numeric) - LAG(value::numeric) OVER (PARTITION BY area, element, item ORDER BY absolute_year ${
                 isMonthlyIndicator(categoryKey) ? ",year_month" : ""
               }), 2),
               0
             ) AS yearly_change
      FROM "${tableName}";
    `);

    // Step 2: Update the main table using a join with the temporary table
    await sq.query(`
      UPDATE "${tableName}"
      SET yearly_change = temp_${tableName}.yearly_change
      FROM temp_${tableName}
      WHERE "${tableName}".id = temp_${tableName}.id;
    `);

    logger.info(`Updated table: ${tableName}, with yearly change values`);
    RESPONSE.Created(res, {
      message: "YOY change calculated and stored successfully.",
    });
  } catch (error) {
    console.error(error);
    logger.error(`Error calculating and storing YOY change: ${error.message}`);
    RESPONSE.ServerError(res, { message: error.message });
  }
};

/**
 * Calculate and store the mean and standard deviation in the db for various categories and items.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return {Promise} a Promise that resolves when the calculation and storage is complete
 */
exports.calculateAndStoreMeanAndStdDev = async (req, res) => {
  try {
    const query = req.query;
    const categoryKey = query.category.toUpperCase();
    const tableModel = CONST_UTILS.TABLE_MODEL(categoryKey);
    const tableName = tableModel.getTableName();

    // Calculate mean and standard deviation per area, element, and item
    const individualCalculationQuery = `
      SELECT area, element, item, 
             AVG(value::numeric) AS mean_value, 
             STDDEV(value::numeric) AS standard_deviation
      FROM "${tableName}"
      WHERE is_forecast = false
      GROUP BY area, element, item;
    `;

    const individualResults = await sq.query(individualCalculationQuery, {
      type: sq.QueryTypes.SELECT,
    });

    // Calculate mean and standard deviation for all countries combined
    const allCountriesCalculationQuery = `
      SELECT 'ALL MASHREQ COUNTRIES' AS area, element, item, 
             AVG(value::numeric) AS mean_value, 
             STDDEV(value::numeric) AS standard_deviation
      FROM "${tableName}"
      WHERE is_forecast = false
      GROUP BY element, item;
    `;

    const allCountriesResults = await sq.query(allCountriesCalculationQuery, {
      type: sq.QueryTypes.SELECT,
    });

    // Calculate mean and standard deviation for all items combined
    await sq.query(
      `CREATE TEMPORARY TABLE temp_yearly_sums AS 
      SELECT area, element, absolute_year, SUM(value::numeric) AS yearly_sum
      FROM "${tableName}"
      WHERE is_forecast = false
      GROUP BY area, element, absolute_year;
      `
    );

    // Step 2: Calculate average and standard deviation of yearly sums
    const allItemsCalculationQuery = `
    SELECT area, element, 'ALL ITEMS' AS item, 
           AVG(yearly_sum) AS mean_value, 
           STDDEV(yearly_sum) AS standard_deviation
    FROM temp_yearly_sums
    GROUP BY area, element;
  `;

    const allItemsResults = await sq.query(allItemsCalculationQuery, {
      type: sq.QueryTypes.SELECT,
    });

    // Combine results and insert into 'thresholds' table
    const combinedResults = [
      ...individualResults,
      ...allCountriesResults,
      ...allItemsResults,
    ];

    // delete previous thresholds
    await DB_MODEL.THRESHOLD.destroy({
      where: {
        category_id: categoryKey,
      },
    });

    //console.log(combinedResults);
    const inputArray = combinedResults.map((result) => {
      const meanValue = parseFloat(result.mean_value).toFixed(2) || 0;
      const standardDeviation =
        parseFloat(result.standard_deviation).toFixed(2) || 0;

      return {
        category_id: categoryKey,
        area: result.area,
        element: result.element,
        item: result.item,
        mean_value: meanValue,
        standard_deviation: standardDeviation,
      };
    });

    await dbBulkCreate(DB_MODEL.THRESHOLD, inputArray);

    logger.info(`Calculated threshold values for category: ${categoryKey}`);
    RESPONSE.Created(res, {
      message:
        "Mean and standard deviation calculated and stored successfully.",
    });
  } catch (error) {
    console.error(error);
    logger.error(
      `Error calculating mean and standard deviation: ${error.message}`
    );
    RESPONSE.ServerError(res, { message: error.message });
  }
};

/**
 * Calculate and store category trends.
 * @param {Request} req - Express Request object.
 * @param {Response} res - Express Response object.
 */
exports.calculateAndStoreCategoryTrends = async (req, res) => {
  try {
    const query = req.query;
    const categoryKey = query.category.toUpperCase();
    const tableModel = CONST_UTILS.TABLE_MODEL(categoryKey);
    const { indicatorDetails } = await getCategoryAndIndicatorDetails(
      categoryKey
    );

    // Handle monthly indicators separately
    if (isMonthlyIndicator(categoryKey)) {
      await createCategoryTrendsForMonthly(
        tableModel,
        categoryKey,
        indicatorDetails
      );
      RESPONSE.Created(res, {
        message: "Category trends stored successfully.",
      });
      return;
    }

    // Fetch the data
    const data = await getIndicatorQueryResponse(tableModel, indicatorDetails, {
      forecast: 2,
      fromYear: "2018",
    });

    // Process the data and store in the category_trends table
    await processAndStoreCategoryTrends(data, categoryKey, indicatorDetails);

    logger.info(
      `Calculated and stored category trends for category: ${categoryKey}`
    );
    RESPONSE.Created(res, { message: "Category trends stored successfully." });
  } catch (error) {
    console.error(error);
    logger.error(`Error storing category trends: ${error.message}`);
    RESPONSE.ServerError(res, { message: error.message });
  }
};

/**
 * Create category trends for monthly indicators.
 * @private
 * @param {Object} tableModel - Sequelize model for the table.
 * @param {string} categoryKey - Key for the category.
 * @param {Object} indicatorDetails - Details of the indicator.
 */
async function createCategoryTrendsForMonthly(
  tableModel,
  categoryKey,
  indicatorDetails
) {
  // Modify indicatorDetails for monthly indicators
  const newIndicatorDetails = {
    ...indicatorDetails,
    //commodities: ["food price inflation"],
    commodities: ["Consumer Prices"], //2024_10_02
  };

  // Fetch the data
  const data = await getMonthlyIndicatorQueryResponse(
    tableModel,
    newIndicatorDetails
  );

  // Process the data and store in the category_trends table
  await processAndStoreCategoryTrends(
    data,
    categoryKey,
    indicatorDetails,
    true
  );
}

/**
 * Process and store category trends data.
 * @private
 * @param {Array} data - Array of data to be processed.
 * @param {string} categoryKey - Key for the category.
 * @param {Object} indicatorDetails - Details of the indicator.
 */
async function processAndStoreCategoryTrends(
  data,
  categoryKey,
  indicatorDetails,
  isMonthly = false
) {
  // Prepare to track the latest year and change percent for each area
  const areaLatestData = {};
  // Delete existing data for given category
  await DB_MODEL.CATEGORY_TRENDS.destroy({
    where: { category_id: categoryKey },
  });

  // Transform the data for category_trends table
  const transformedData = data.map((record) => {
    const {
      yearly_change,
      absolute_year,
      is_forecast,
      year_month,
      value,
      area,
    } = record.dataValues;
    const yearlyChangePercent = getPercentageChange(
      yearly_change,
      value,
      indicatorDetails.unit
    );

    const absYear = isMonthly ? year_month : absolute_year;
    // Update the latest year and its change percentage per area
    if (
      !areaLatestData[area] ||
      (isMonthly
        ? compareMonth(areaLatestData[area].latestYear, year_month)
        : compareYear(
            areaLatestData[area].latestYear,
            absolute_year,
            is_forecast
          ))
    ) {
      areaLatestData[area] = {
        latestYear: absYear,
        latestYearChangePercent: yearlyChangePercent,
      };
    }

    return {
      category_id: categoryKey,
      area: area,
      year: absYear,
      value: parseFloat(value.toFixed(2)),
      yearly_change: parseFloat(yearly_change.toFixed(2)),
      yearly_change_percentage: parseFloat(yearlyChangePercent.toFixed(2)),
    };
  });

  // Assign the latest year and change percentage for each area
  transformedData.forEach((record) => {
    const areaData = areaLatestData[record.area];
    record.latest_year = areaData.latestYear;
    record.latest_year_change_percentage = areaData.latestYearChangePercent;
    record.is_positive = indicatorDetails.isPositive;
  });

  // Store the data in category_trends table
  await dbBulkCreate(DB_MODEL.CATEGORY_TRENDS, transformedData);
}
