const express = require("express");
const {
  getIndicatorData,
  getIndicatorList,
} = require("../controllers/indicator.controller");
const { validateRequestBody } = require("../middleware/validator");
const REQ_SCHEMA = require("../models/index.schema");
const router = express.Router();

/**
 * @swagger
 * /indicator:
 *   post:
 *     summary: Get indicator data
 *     tags: [Indicators]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 example: consumption
 *               indicator:
 *                 type: string
 *                 example: domestic supply quantity
 *     responses:
 *       200:
 *         description: Successfully fetched indicator data
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
 *                             value2:
 *                               type: number
 *                             yearly_change2:
 *                               type: number
 *                             value1:
 *                               type: number
 *                             yearly_change1:
 *                               type: number
 *                             value0:
 *                               type: number
 *                             yearly_change0:
 *                               type: number
 *                 status:
 *                   type: integer
 *             example:
 *               data:
 *                 - area: Egypt
 *                   is3YearAverage: false
 *                   unit: T
 *                   latestYear: "2021"
 *                   latestYearChange: 1.55
 *                   isPositive: true
 *                   isGreen: true
 *                   is2dData: true
 *                   noOfDimensions: 3
 *                   items: ["Wheat", "Rice", "Maize"]
 *                   threshold: [1776780, 6388170, 3978850]
 *                   data:
 *                     - year: "2018"
 *                       isForecast: false
 *                       value2: 17376000
 *                       yearly_change2: -12.35
 *                       value1: 4775000
 *                       yearly_change1: -12.3
 *                       value0: 17915000
 *                       yearly_change0: -1.33
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
 *                   example: "Failed to fetch indicator data"
 */

router.post(
  "/",
  validateRequestBody(REQ_SCHEMA.INDICATOR.getIndicatorData),
  getIndicatorData
);

/**
 * @swagger
 * /indicator/list:
 *   get:
 *     summary: Get indicator list
 *     tags: [Indicators]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: The category of indicators to filter by
 *         example: food_security
 *     responses:
 *       200:
 *         description: Successfully fetched indicator list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     indicatorList:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["emissions - fumes", "energy usage", "fertilizers", "fertilizers - export", "fertilizers - import", "land area share - agriculture", "land area share - forest", "pesticides", "water use efficiency"]
 *                 status:
 *                   type: integer
 *                   example: 200
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch indicator list"
 */

router.get("/list", getIndicatorList);

module.exports = router;
