const { CATEGORY } = require("../constants/category.constants");
const {
  CATEGORY_TABLE_REGEX,
  TABLE_NAMES,
  ALERT_TABLE_REGEX,
  OTHER_TABLE_REGEX,
} = require("../constants/table.constants");
const { TableDetails } = require("../models/entities/TableDetails");
const CONST_UTILS = require("./constantUtils");

/**
 * Generates table details based on the input provided, including table name, category, and table model.
 *
 * @param {string} input - The input string to generate table details from
 * @return {TableDetails} The table details generated from the input
 */
exports.getTableDetails = (input) => {
  const tableDetails = new TableDetails();

  // non category tables
  for (const key in OTHER_TABLE_REGEX) {
    if (OTHER_TABLE_REGEX[key].test(input)) {
      tableDetails.tableName = TABLE_NAMES[key].toUpperCase();
      break;
    }
  }

  // alerts table (special case)
  if (ALERT_TABLE_REGEX.test(input)) {
    tableDetails.tableName = TABLE_NAMES.ALERTS.toUpperCase();
  }

  // category tables
  for (const key in CATEGORY_TABLE_REGEX) {
    if (CATEGORY_TABLE_REGEX[key].test(input)) {
      // if alerts table
      if (!tableDetails.tableName) {
        tableDetails.tableName =
          TABLE_NAMES[key].toUpperCase() || key.toUpperCase();
      }
      tableDetails.category = CATEGORY[key];
      break;
    }
  }

  if (!tableDetails._tableName) {
    throw new Error("Invalid table name or file name");
  }

  tableDetails.tableModel = CONST_UTILS.TABLE_MODEL(tableDetails.tableName);
  return tableDetails;
};
