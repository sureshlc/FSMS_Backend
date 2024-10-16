const express = require("express");
const {
  getAlerts,
  getCategoryTrend,
  getAlertRank,
  getAlertNotifications,
} = require("../controllers/alerts.controller");
const {
  validateRequestBody,
  validateRequestQuery,
  validateRequestParams,
} = require("../middleware/validator");
const REQ_SCHEMA = require("../models/index.schema");
const router = express.Router();

/**
 * @swagger
 *  /alerts:
 *   post:
 *     summary: Create a new alert
 *     tags: [Alerts]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              category:
 *                type: string
 *                example: production_trade
 *              threshold:
 *                type: string
 *                example: true
 *
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       displayName:
 *                         type: string
 *                       value:
 *                         type: string
 *                       data:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             area:
 *                               type: string
 *                             category:
 *                               type: string
 *                             iso3_code:
 *                               type: string
 *                             rank:
 *                               type: integer
 *                             latitude:
 *                               type: number
 *                             longitude:
 *                               type: number
 *               status: integer
 *             example:
 *               data:
 *                 - displayName: "Production and Trade Clusters"
 *                   value: "production_trade"
 *                   data:
 *                     - area: "Syrian Arab Republic"
 *                       category: "PRODUCTION_TRADE"
 *                       iso3_code: "SYR"
 *                       rank: 6
 *                       latitude: 34.8021
 *                       longitude: 38.9968
 *                     - area: "Iraq"
 *                       category: "PRODUCTION_TRADE"
 *                       iso3_code: "IRQ"
 *                       rank: 5
 *                       latitude: 33.3152
 *                       longitude: 44.3661
 *                     - area: "Lebanon"
 *                       category: "PRODUCTION_TRADE"
 *                       iso3_code: "LBN"
 *                       rank: 4
 *                       latitude: 33.8547
 *                       longitude: 35.8623
 *                     - area: "Palestine"
 *                       category: "PRODUCTION_TRADE"
 *                       iso3_code: "PSE"
 *                       rank: 3
 *                       latitude: 31.9522
 *                       longitude: 35.2332
 *               status: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch alert"
 */

router.post(
  "/",

  validateRequestBody(REQ_SCHEMA.ALERTS.getAlerts),
  getAlerts
);

/**
 * @swagger
 * /alerts/trend:
 *   post:
 *     summary: Get category trend
 *     tags: [Alerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: food_security
 *               area:
 *                 type: string
 *                 example: egypt
 *               sort:
 *                 type: integer
 *                 example: 1
 *               fromYear:
 *                 type: string
 *                 example: '2018'
 *               forecast:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Successfully fetched alert notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       area:
 *                         type: string
 *                       is3YearAverage:
 *                         type: boolean
 *                       unit:
 *                         type: string
 *                       latestYear:
 *                         type: string
 *                       latestYearChange:
 *                         type: number
 *                       isPositive:
 *                         type: boolean
 *                       isGreen:
 *                         type: boolean
 *                       is2dData:
 *                         type: boolean
 *                       noOfDimensions:
 *                         type: number
 *                       items:
 *                         type: array
 *                         items:
 *                           type: string
 *                       threshold:
 *                         type: array
 *                         items:
 *                           type: number
 *                       data:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             year:
 *                               type: string
 *                             isForecast:
 *                               type: boolean
 *                             value:
 *                               type: number
 *                             yearly_change:
 *                               type: number
 *               status:
 *                 type: integer
 *             example:
 *               data:
 *                 - rank: 1
 *                   title: Prevalence of undernourishment
 *                   area: Egypt
 *                   is3YearAverage: true
 *                   unit: "%"
 *                   latestYear: "2020-2022"
 *                   latestYearChange: 0.1
 *                   isPositive: false
 *                   isGreen: false
 *                   is2dData: false
 *                   noOfDimensions: 1
 *                   items: ["prevalence of undernourishment"]
 *                   threshold: [3.19, 15.03]
 *                   data:
 *                     - year: "2020-2022"
 *                       isForecast: false
 *                       value: 7.2
 *                       yearly_change: 0.1
 *                     - year: "2019-2021"
 *                       isForecast: false
 *                       value: 6.4
 *                       yearly_change: 0.5
 *                     - year: "2018-2020"
 *                       isForecast: false
 *                       value: 6.3
 *                       yearly_change: 0.1
 *                     - year: "2017-2019"
 *                       isForecast: false
 *                       value: 6.3
 *                       yearly_change: 0.1
 *                     - year: "2016-2018"
 *                       isForecast: false
 *                       value: 6.4
 *                       yearly_change: null
 *               status: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch category trend"
 */

router.post(
  "/trend",

  validateRequestBody(REQ_SCHEMA.ALERTS.getCategoryTrend),
  getCategoryTrend
);

/**
 * @swagger
 * /alerts/notifications:
 *   get:
 *     summary: Get alert notifications
 *     tags: [Alerts]
 *     parameters:
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: The area for which notifications are requested
 *         example: Palestine
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category for which notifications are requested
 *         example: food_security
 *     responses:
 *       200:
 *         description: Successfully fetched alert notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       area:
 *                         type: string
 *                       iso3_code:
 *                         type: string
 *                       category:
 *                         type: string
 *                       year:
 *                         type: string
 *                       month:
 *                         type: string
 *                       description:
 *                         type: string
 *               status:
 *                 type: integer
 *             example:
 *               data:
 *                 - area: Palestine
 *                   iso3_code: PSE
 *                   category: FOOD_SECURITY
 *                   year: "2024"
 *                   month: January
 *                   description: "In 2023 & 2024, Palestine's prevalence of undernourishment would reach 14.1%, 5% higher than 2022"
 *               status: 200
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error400'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch alert notifications"
 */

router.get(
  "/notifications",

  validateRequestParams(REQ_SCHEMA.ALERTS.getAlertNotifications),
  getAlertNotifications
);

module.exports = router;
