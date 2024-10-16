const { Sequelize } = require("sequelize");
const DB_MODEL = require("../models/index.model");
const { getCategoryDetails } = require("../services/categoryService");
const { getCountryDetails } = require("../services/countryService");
const { QUERY_SORT_ASC } = require("../constants");
const {
  getAlertTrends,
  categoryCaseStatement,
} = require("../helper/alertsHelper");

exports.getAlertsHandler = {
  /**
   * Builds a where clause based on the given query parameters.
   */
  buildWhereClause: (query) => {
    return {
      ...(query.category && {
        category: { [Sequelize.Op.iLike]: query.category },
      }),
      ...(query.year && { year: query.year }),
      ...(query.area && { area: { [Sequelize.Op.iLike]: query.area } }),
      ...(query.threshold && { threshold: query.threshold }),
    };
  },

  /**
   * Fetches alerts based on the provided where clause and sort order.
   */
  fetchAlerts: async (whereClause, sort) => {
    // Fetch alerts
    return await DB_MODEL.ALERTS.findAll({
      attributes: ["category", "area", "rank", "cluster", "year"],
      where: whereClause,
      order: [
        [categoryCaseStatement, "ASC"],
        ["area", sort === QUERY_SORT_ASC ? "DESC" : "ASC"], //2024_10_02: sort by country(prev:rank)
      ],
    });
  },

  /**
   * Process alerts and return relevant details.
   * @param {Object} alert - The alert object to process.
   * @param {boolean} includeTrend - Whether to include trend data.
   */
  processAlerts: async (alert, includeTrend) => {
    const trend = includeTrend ? await getAlertTrends(alert) : undefined;
    const country = await getCountryDetails(alert.area);
    return {
      area: alert.area,
      category: alert.category,
      iso3_code: country.iso3_code,
      rank: alert.rank,
      latitude: country.latitude,
      longitude: country.longitude,
      trend,
    };
  },

  /**
   * Groups alerts by category and returns an object with the grouped alerts.
   */
  groupAlerts: (alerts) => {
    return alerts.reduce((acc, alert) => {
      const categoryKey = alert.category.toLowerCase();
      if (!acc[categoryKey]) acc[categoryKey] = [];
      acc[categoryKey].push(alert);
      return acc;
    }, {});
  },

  /**
   * Asynchronously formats alerts into a new structure with display names and values.
   */
  formatAlerts: async (alerts) => {
    return await Promise.all(
      Object.entries(alerts).map(async ([category, data]) => {
        // get the display name
        const { display_name } = await getCategoryDetails(
          category?.toUpperCase()
        );
        return {
          displayName: display_name || category,
          value: category,
          data,
        };
      })
    );
  },
};

exports.getCategoryTrendHandler = {
  /**
   * Retrieves trend alerts based on the provided query.
   *
   */
  getTrendAlerts: async (query) => {
    const whereClause = {
      category: query.category.toUpperCase(),
      ...(query.area && { area: { [Sequelize.Op.iLike]: query.area } }),
      ...(query.threshold && { threshold: query.threshold }),
    };

    return await DB_MODEL.ALERTS.findAll({
      attributes: ["area", "rank"],
      order: [["area", "ASC"]], //2024_10_02 changed from rank to area
      where: whereClause,
    });
  },

  /**
   * Formats the response based on the trend alerts.
   */
  formatResponse: (responses, alerts, trendIndicator) => {
    return alerts.map((alert) => {
      const response = responses.find((r) => r.area === alert.area);
      if (!response) return null;
      return {
        rank: alert.rank,
        title: trendIndicator,
        ...response,
      };
    });
  },
};

exports.getNotificationsHandler = {
  /**
   * Builds a where clause based on the given query parameters.
   */
  buildWhereClause: (query) => {
    return {
      ...(query.category && {
        category: { [Sequelize.Op.iLike]: query.category },
      }),
      ...(query.area && { area: { [Sequelize.Op.iLike]: query.area } }),
    };
  },

  /**
   * Fetches notifications based on the provided where clause from the Db
   */
  getNotifications: async (whereClause) => {
    return await DB_MODEL.ALERT_NOTIFICATIONS.findAll({
      attributes: ["category", "area", "year", "month", "description"],
      where: whereClause,
      order: [
        ["year", "DESC"],
        ["month", "DESC"],
      ],
    });
  },

  /**
   * Formats the response with iso3_code
   */
  formatWithIso3Code: async (notifications) => {
    return await Promise.all(
      notifications.map(async (notification) => {
        const { area, category, year, month, description } =
          notification.dataValues;
        const countryDetails = await getCountryDetails(area);
        const iso3_code = countryDetails?.iso3_code;
        return {
          area,
          iso3_code,
          category,
          year,
          month,
          description,
        };
      })
    );
  },
};
