const { Model } = require("sequelize");
const {
  getIndicatorQueryResponse,
  processIndicatorResponse,
} = require("../helper/indicatorHelper");
const {
  getMonthlyIndicatorQueryResponse,
  processMonthlyIndicatorResponse,
  isMonthlyIndicator,
} = require("../helper/monthlyIndicatorHelper");
const { groupArrayByKey } = require("../utils/jsonUtils");
const IndicatorDetails = require("../models/entities/IndicatorDetails");
const CategoryDetails = require("../models/entities/CategoryDetails");

exports.getIndicatorHandler = {
  /**
   * A function that retrieves the response for an indicator.
   *
   * @param {Model} tableModel - table model
   * @param {IndicatorDetails} indicatorDetails
   * @param {Object} query
   * @param {CategoryDetails} categoryDetails
   * @return {IndicatorResponse} - indicator response
   */
  getIndicatorResponse: async (
    tableModel,
    indicatorDetails,
    query,
    categoryDetails
  ) => {
    if (isMonthlyIndicator(categoryDetails?.name, indicatorDetails?.name)) {
      return await exports.getIndicatorHandler.handleMonthlyIndicatorData(
        tableModel,
        indicatorDetails,
        query
      );
    } else {
      return await exports.getIndicatorHandler.handleYearlyIndicatorData(
        tableModel,
        indicatorDetails,
        query
      );
    }
  },

  /**
   * Asynchronously handles the monthly indicator data.
   *
   */
  handleMonthlyIndicatorData: async (tableModel, indicatorDetails, query) => {
    const queryResult = await getMonthlyIndicatorQueryResponse(
      tableModel,
      indicatorDetails,
      query
    );
    const groupedByArea = groupArrayByKey(
      queryResult.map((item) => item?.dataValues),
      "area"
    );
    return await processMonthlyIndicatorResponse(
      groupedByArea,
      indicatorDetails
    );
  },

  /**
   * Asynchronously handles the yearly indicator data.
   *
   */
  handleYearlyIndicatorData: async (tableModel, indicatorDetails, query) => {
    const queryResult = await getIndicatorQueryResponse(
      tableModel,
      indicatorDetails,
      query
    );
    const groupedByArea = groupArrayByKey(
      queryResult.map((item) => item?.dataValues),
      "area"
    );
    return await processIndicatorResponse(groupedByArea, indicatorDetails);
  },
};
