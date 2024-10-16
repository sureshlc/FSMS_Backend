const CategoryDetails = require("../models/entities/CategoryDetails");
const IndicatorDetails = require("../models/entities/IndicatorDetails");
const {
  getCategoryDetails,
  getIndicatorDetails,
} = require("../services/categoryService");

/**
 * Retrieves category and indicator details based on the provided category, indicator, and commodity.
 *
 * @param {string} category - The category for which details are to be retrieved
 * @param {string} indicator - The indicator for which details are to be retrieved
 * @param {string} commodity - The commodity for which details are to be retrieved
 * @return {CategoryDetails, IndicatorDetails} The category and indicator details
 */
exports.getCategoryAndIndicatorDetails = async (
  category,
  indicator = null,
  commodity = null
) => {
  const categoryKey = category.toUpperCase();
  const categoryDetailsValues = await getCategoryDetails(categoryKey);

  if (!categoryDetailsValues) {
    throw new Error(`Category details not found for ${category}`);
  }

  // creating category details
  let categoryDetails = new CategoryDetails(
    categoryKey,
    categoryDetailsValues?.display_name,
    categoryDetailsValues?.unit,
    categoryDetailsValues?.column,
    categoryDetailsValues?.trend_indicator
  );

  const indicatorKey =
    indicator?.toLowerCase() ||
    categoryDetails.trendIndicator?.toLowerCase() ||
    null;

  const indicatorDetailsValues = await getIndicatorDetails(indicatorKey);

  if (!indicatorDetailsValues) {
    return { categoryDetails, indicatorDetails: null };
  }

  // creating indicator details
  let indicatorDetails = new IndicatorDetails(
    indicatorKey,
    indicatorDetailsValues?.unit || categoryDetails?.defaultUnit,
    indicatorDetailsValues?.column || categoryDetails?.defaultColumn,
    indicatorDetailsValues?.items || [indicatorKey],
    indicatorDetailsValues?.commodities || null,
    indicatorDetailsValues?.legends || [],
    indicatorDetailsValues?.is_positive || false,
    indicatorDetailsValues?.no_of_dimensions || 1,
    indicatorDetailsValues?.is_2d_data || false,
    indicatorDetailsValues?.threshold_display || "COUNTRY",
    indicatorDetailsValues?.is_3y_avg || false
  );

  // Modify indicator details if commodity is provided
  if (commodity) {
    indicatorDetails.commodities = [commodity];
    indicatorDetails.legends = [commodity];
    indicatorDetails.noOfDimensions = 1;
  }
  categoryDetails.setIndicatorDetails(indicatorDetails);

  return { categoryDetails, indicatorDetails };
};
