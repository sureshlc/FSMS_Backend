const DB_MODEL = require("../models/index.model");
const { dbBulkCreate } = require("../services/dbService");
const { getDbUploadJsonArray } = require("../utils/jsonUtils");
const { getTableDetails } = require("../utils/tableUtils");

/**
 * Uploads a CSV file to the database.
 *
 * @param {string} tableName - The name of the table in the database.
 * @param {Array} jsonArray - An array of JSON objects representing the data to be uploaded.
 * @return {Object} - An object containing the fileName and tableName of the uploaded file.
 */
exports.uploadCSV = async (tableName, jsonArray) => {
  // get tableDetails
  const tableDetails = getTableDetails(tableName);

  // transform jsonArray
  const transformJsonArray = getDbUploadJsonArray(tableDetails, jsonArray);

  // upload to DB
  await dbBulkCreate(tableDetails._tableModel, transformJsonArray);

  return {
    file: tableName,
    table: tableDetails._tableName,
  };
};

/**
 * Returns a filtered list of objects by removing the ones that are already processed.
 *
 * @param {Array} objectList - The list of objects to filter.
 * @return {Array} filteredObjectList - The filtered list of objects.
 */
exports.getObjectFilteredList = async (objectList) => {
  const processedFiles = await DB_MODEL.MANIFEST.findAll({
    attributes: ["tag"],
  });
  const processFileSet = new Set(processedFiles.map((obj) => obj.tag));

  // removing files that are already processed
  const filteredObjectList = objectList.filter(
    (obj) => !processFileSet.has(obj.ETag)
  );
  return filteredObjectList;
};

/**
 * Adds processed files to the manifest database.
 *
 * @param {string} name - The name of the file.
 * @param {string} tag - The tag associated with the file.
 */
exports.addProcessedFiles = async (name, tag) => {
  await DB_MODEL.MANIFEST.create({ name, tag });
};

/**
 * Determines if the given file name represents a CSV file or an Excel file.
 *
 * @param {string} fileName - The name of the file to check.
 * @return {boolean} Returns true if the file is a CSV file or an Excel file, otherwise false.
 */
exports.isCSVFile = (fileName) => {
  const isCSVFile = /\.csv$/i.test(fileName);
  const isExcelFile = /\.xlsx$/i.test(fileName);

  return isCSVFile || isExcelFile;
};
