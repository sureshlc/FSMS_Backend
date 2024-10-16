const NodeCache = require("node-cache");
const DB_MODEL = require("../models/index.model");
const countryCache = new NodeCache({ stdTTL: 10000 });

/**
 * Caches country details in memory
 *
 */
async function cacheCountryDetails() {
  try {
    const countries = await DB_MODEL.COUNTRY.findAll();
    const cacheData = {};

    countries.forEach((country) => {
      cacheData[country.area.toUpperCase()] = country;
    });
    countryCache.set("countries", cacheData);
    console.log("Caching country details...");
  } catch (error) {
    console.error("Error in cacheCountryDetails:", error);
    throw error;
  }
}

/**
 * Retrieves country details based on the area provided
 *
 * @param {string} area - The area for which country details are requested
 * @return {Object|null} The country details for the specified area, or null
 */
exports.getCountryDetails = async (area) => {
  try {
    let cacheData = countryCache.get("countries");

    // If cache is empty or expired, fetch and cache again
    if (!cacheData) {
      await cacheCountryDetails();
      cacheData = countryCache.get("countries");
    }

    // Retrieve country details from the cache
    const areaKey = area?.toUpperCase();
    return cacheData[areaKey] || null;
  } catch (error) {
    console.error("Error getting country details:", error);
    throw error;
  }
};
