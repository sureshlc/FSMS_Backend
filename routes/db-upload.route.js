const express = require("express");
const {
  fetchS3DataAndUploadToDB,
  uploadCsvToDB,
} = require("../controllers/db-upload.controller");
const router = express.Router();
const uploadHandler = require("../middleware/multer");
const csvUpload = require("../configuration/multer.instance");
const { validateRequestBody } = require("../middleware/validator");
const REQ_SCHEMA = require("../models/index.schema");

/**
 * @swagger
 * /populate-database/s3:
 *   post:
 *     summary: Fetch S3 data and upload to database
 *     tags: [Database Upload]
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sucessfully uploaded the following files"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to fetch S3 data and upload to database"
 */

router.post("/s3", fetchS3DataAndUploadToDB);

/**
 *  @swagger
 * /populate-database/csv:
 *   post:
 *     summary: Upload CSV to database
 *     tags: [Database Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully uploaded CSV to database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sucessfully uploaded the following files"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request body"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to upload CSV to database"
 */

router.post(
  "/csv",
  uploadHandler(csvUpload),
  validateRequestBody(REQ_SCHEMA.UPLOAD.uploadSchema),

  uploadCsvToDB
);

module.exports = router;
