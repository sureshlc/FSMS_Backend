const dbUploadRoutes = require("../routes/db-upload.route");
const alertRoutes = require("../routes/alerts.route");
const countryRoutes = require("../routes/country.route");
const lastUpdatedRoutes = require("../routes/last-updated.route");
const indicatorRoutes = require("../routes/indicator.route");
const calcRoutes = require("../routes/calc.route");
const authRoutes = require("../routes/auth.route");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swagger/swagger");
const { authToken } = require("../middleware/authMiddleware");

const API_ENDPOINT = process.env.ENV_API_ENDPOINT || "/api";

const routes = (app) => {
  // test endpoint

  app.get(API_ENDPOINT, (req, res) => {
    res.send("Hello, World!");
  });

  // swagger docs

  app.use(
    API_ENDPOINT + "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );

  // auth

  app.use(API_ENDPOINT + "/auth", authRoutes);

  // upload to db
  app.use(API_ENDPOINT + "/populate-database", authToken, dbUploadRoutes);

  // alerts
  app.use(API_ENDPOINT + "/alerts", authToken, alertRoutes);

  // country
  app.use(API_ENDPOINT + "/country", authToken, countryRoutes);

  // last updated
  app.use(API_ENDPOINT + "/last-updated", authToken, lastUpdatedRoutes);

  // indicator data
  app.use(API_ENDPOINT + "/indicator", authToken, indicatorRoutes);

  // calcuations
  app.use(API_ENDPOINT + "/calc", calcRoutes);
};

module.exports = routes;

/**
 * @swagger
 * components:
 *   schemas:
 *     Error400:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Invalid request body"
 *             details:
 *               type: string
 *               example: "\"something\" is required"
 *         status:
 *           type: integer
 *           example: 400
 */
