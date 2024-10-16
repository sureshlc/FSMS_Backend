const express = require("express");
const { getLastUpdated } = require("../controllers/last-updated.controllers");
const router = express.Router();

/**
 * @swagger
 * /last-updated/get:
 *   get:
 *     summary: Get the last updated timestamp
 *     tags: [Last Updated]
 *     responses:
 *       200:
 *         description: Successfully fetched the last updated timestamp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                     time:
 *                       type: string
 *                 status:
 *                   type: integer
 *             example:
 *               data:
 *                 date: "Mar 2, 2024"
 *                 time: "10:58:55 AM UTC"
 *               status: 200
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch last updated timestamp"
 */

router.get("/get", getLastUpdated);

module.exports = router;
