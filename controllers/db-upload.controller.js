const { listS3Objects, getS3ObjectStream } = require("../services/s3Service");
const s3BucketName = process.env.ENV_S3_BUCKET_NAME;
const fs = require("fs");
const { s3Client } = require("../configuration/aws.config");
const RESPONSE = require("../common/response");
const { csvParseFile, csvParseStream } = require("../services/csvService");
const {
  uploadCSV,
  getObjectFilteredList,
  addProcessedFiles,
  isCSVFile,
} = require("../helper/uploadHelper");
const { S3_LIST_OBJECT_REQUEST } = require("../constants/service.constants");
const { setLastUpdated } = require("./last-updated.controllers");
const logger = require("../common/logger");

/**
 * Fetches data from S3 and uploads it to the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return - the list of processed files on success
 */
exports.fetchS3DataAndUploadToDB = async (req, res) => {
  try {
    // get object List
    const objectList = await listS3Objects(s3Client, S3_LIST_OBJECT_REQUEST);
    logger.info(`Fetched ${objectList.Contents.length} files from s3`);

    const filteredObjectList = await getObjectFilteredList(objectList.Contents);
    logger.info(`Filtered List of ${filteredObjectList.length} files`);

    const result = [];
    // read and map csv data
    for (const obj of filteredObjectList) {
      // skip non csv files
      if (!isCSVFile(obj.Key)) continue;
      try {
        const jsonArray = await csvParseStream(
          getS3ObjectStream(s3Client, {
            Bucket: s3BucketName,
            Key: obj.Key,
          })
        );
        let response = await uploadCSV(obj.Key, jsonArray);
        await addProcessedFiles(obj.Key, obj.ETag);

        result.push(response);
        logger.info(
          `Processed file: ${response.file} into table: ${response.table}`
        );
      } catch (error) {
        logger.error(`Error processing file ${obj.Key}: ${error.message}`);
        // continue if this file is not processed
        continue;
      }
    }
    await setLastUpdated(); // update last updated timestamp

    RESPONSE.Created(res, {
      message: "Sucessfully uploaded the following files",
      data: result,
    });
  } catch (error) {
    console.error(error);
    logger.error(`Error processing S3 uploads: ${error.message}`);
    RESPONSE.ServerError(res, { message: error.message });
  }
};

/**
 * Uploads a CSV file to the database.
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @return - the list of processed files on success
 */
exports.uploadCsvToDB = async (req, res) => {
  try {
    const tableName = req.body.tableName || req.file.originalname;
    const jsonArray = await csvParseFile(req.file.path);

    // handle upload
    let response = await uploadCSV(tableName, jsonArray);
    // add file name
    response.file = req.file.originalname;

    await setLastUpdated(); // update last updated timestamp
    logger.info(
      `Processed file: ${response.file} into table: ${response.table}`
    );

    RESPONSE.Created(res, {
      message: "Sucessfully uploaded the following files",
      data: response,
    });
  } catch (error) {
    console.error(error);
    logger.error(
      `Error processing file ${req.file.originalname}: ${error.message}`
    );

    RESPONSE.ServerError(res, { message: error.message });
  } finally {
    // delete file
    fs.unlinkSync(req.file.path);
  }
};
