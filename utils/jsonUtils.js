const { TABLE_NAMES } = require("../constants/table.constants");
const TABLE_TRANSFORM_FN = require("../constants/tableFn.constants");
const { TableDetails } = require("../models/entities/TableDetails");
const CONST_UTILS = require("./constantUtils");

/**
 * Transforms an array of JSON objects using a given transformation function.
 */
const transformJsonArray = (jsonArray, transformFn = (k) => k) => {
  return jsonArray.map((obj) => transformFn(obj));
};

/**
 * Generates a JSON array to be uploaded to the database.
 *
 * @param {TableDetails} tableDetails - The details of the table.
 * @param {array} jsonArray - The array to be transformed.
 * @return {array} The transformed JSON array.
 */
const getDbUploadJsonArray = (tableDetails, jsonArray) => {
  if (tableDetails._tableName === TABLE_NAMES.ALERTS.toUpperCase()) {
    // here alerts transformation also includes the category
    const transformFn = TABLE_TRANSFORM_FN.ALERTS(tableDetails._category);
    return transformJsonArray(jsonArray, transformFn);
  }

  const transformFn = CONST_UTILS.TABLE_TRANSFORM_FN(tableDetails._tableName);
  return transformJsonArray(jsonArray, transformFn);
};

/**
 * Groups an array of objects by a specified key and removes that key from the grouped objects.
 *
 * @param {Object[]} array - The array of objects to be grouped.
 * @param {string} key - The key to group by.
 * @returns {Object} - An object with keys as the grouped values and values as arrays of objects.
 */
const groupArrayByKey = (array, key) => {
  return array.reduce((grouped, item) => {
    // Extract the key value for grouping
    const keyValue = item[key];
    if (!grouped[keyValue]) {
      grouped[keyValue] = [];
    }

    // Create a new object without the key
    const { [key]: removed, ...rest } = item;
    grouped[keyValue].push(rest);

    return grouped;
  }, {});
};

module.exports = {
  getDbUploadJsonArray,
  groupArrayByKey,
};
