const express = require("express");
const router = express.Router();
const { getCountryList } = require("../controllers/country.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               area:
 *                 type: string
 *               iso3_code:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 */

/**
 * @swagger
 * /country:
 *   get:
 *     summary: Get list of countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *             example:
 *               data:
 *                 - area: Egypt
 *                   iso3_code: EGY
 *                   latitude: 26.8206
 *                   longitude: 30.8025
 *                 - area: Iraq
 *                   iso3_code: IRQ
 *                   latitude: 33.3152
 *                   longitude: 44.3661
 *                 - area: Jordan
 *                   iso3_code: JOR
 *                   latitude: 30.5852
 *                   longitude: 36.2384
 *                 - area: Lebanon
 *                   iso3_code: LBN
 *                   latitude: 33.8547
 *                   longitude: 35.8623
 *                 - area: Palestine
 *                   iso3_code: PSE
 *                   latitude: 31.9522
 *                   longitude: 35.2332
 *                 - area: Syrian Arab Republic
 *                   iso3_code: SYR
 *                   latitude: 34.8021
 *                   longitude: 38.9968
 *             status: 200
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve list of countries"
 */

router.get("/", getCountryList);

module.exports = router;
