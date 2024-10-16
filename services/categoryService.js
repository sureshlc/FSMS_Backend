const NodeCache = require("node-cache");
const DB_MODEL = require("../models/index.model");
const categoryCache = new NodeCache({ stdTTL: 10000 });
const indicatorCache = new NodeCache({ stdTTL: 10000 });

/**
 * @private
 * Caches the details of all categories in the database.
 */
async function cacheCategoryDetails() {
  try {
    const categories = await DB_MODEL.CATEGORY_DETAILS.findAll();
    const cacheData = {};

    categories.forEach((category) => {
      cacheData[category.category_id] = category;
    });

    // Set the cache with a specific TTL (in seconds)
    categoryCache.set("categories", cacheData);
    console.log("Caching category details...");
  } catch (error) {
    throw error;
  }
}

/**
 * @private
 * Caches the details of all indicators in the database.
 */
async function cacheIndicatorDetails() {
  try {
    const indicators = await DB_MODEL.INDICATOR_DETAILS.findAll();
    const cacheData = {};

    indicators.forEach((indicator) => {
      cacheData[indicator.indicator_name] = indicator;
    });

    // Set the cache with a specific TTL (in seconds)
    indicatorCache.set("indicators", cacheData);
    console.log("Caching indicator details...");
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieves the details of a category from the cache or fetches from the server if not cached.
 *
 * @param {string} categoryId - The ID of the category to retrieve
 * @return {object} The details of the specified category, or null if not found
 */
exports.getCategoryDetails = async (categoryId) => {
  try {
    let cacheData = categoryCache.get("categories");
    if (!cacheData) {
      await cacheCategoryDetails();
      cacheData = categoryCache.get("categories");
    }
    return cacheData[categoryId?.toUpperCase()] || null;
  } catch (error) {
    console.error(`Error getting category details: ${error.message}`);
    throw error;
  }
};

/**
 * Retrieves the details of an indicator from the cache, and if not present,
 * fetches the details and then retrieves them from the cache.
 *
 * @param {string} indicatorName - The name of the indicator to retrieve details for
 * @return {object} The details of the indicator, or null if not found
 */
exports.getIndicatorDetails = async (indicatorName) => {
  try {
    let cacheData = indicatorCache.get("indicators");
    if (!cacheData) {
      await cacheIndicatorDetails();
      cacheData = indicatorCache.get("indicators");
    }
    return cacheData[indicatorName?.toLowerCase()] || null;
  } catch (error) {
    console.error(`Error getting indicator details: ${error.message}`);
    throw error;
  }
};

// Pre-populate the cache when the application starts
// cacheCategoryDetails();
// cacheIndicatorDetails();
