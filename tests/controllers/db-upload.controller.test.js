// Mock Modules
jest.mock("../../services/csvService", () => {
  return {
    csvParseFile: jest.fn(),
    csvParseStream: jest.fn(),
  };
});

jest.mock("../../common/response", () => {
  return {
    ServerError: jest.fn(),
    Created: jest.fn(),
  };
});

jest.mock("../../helper/uploadHelper", () => {
  return {
    uploadCSV: jest.fn(),
    getObjectFilteredList: jest.fn(),
    isCSVFile: jest.fn(),
    addProcessedFiles: jest.fn(),
  };
});

jest.mock("../../services/s3Service", () => {
  return {
    listS3Objects: jest.fn(),
    getS3ObjectStream: jest.fn(),
  };
});

// lastupdated
jest.mock("../../controllers/last-updated.controllers", () => {
  return {
    setLastUpdated: jest.fn(),
  };
});

jest.mock("fs");
// Imports Modules
const {
  uploadCsvToDB,
  fetchS3DataAndUploadToDB,
} = require("../../controllers/db-upload.controller");
const {
  uploadCSV,
  isCSVFile,
  getObjectFilteredList,
  addProcessedFiles,
} = require("../../helper/uploadHelper");
const { csvParseFile, csvParseStream } = require("../../services/csvService");
const RESPONSE = require("../../common/response");
const fs = require("fs");
const { listS3Objects } = require("../../services/s3Service");

describe("uploadCsvToDB", () => {
  let mockReq;
  let mockRes;
  beforeEach(() => {
    mockReq = {
      file: {},
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // constants
  const jsonArray = [
    {
      attribute: "value",
      attribute2: "value2",
    },
    {
      attribute: "value",
      attribute2: "value2",
    },
  ];

  const response = {
    file: "test",
    table: "test-table",
  };

  // mock implementations
  csvParseFile.mockReturnValue(jsonArray);

  it("should return status 201 on success", async () => {
    // Arrange
    mockReq.file = {
      originalname: "test-table",
      path: "test-path",
    };

    // Mock implementation
    uploadCSV.mockResolvedValue(response);
    fs.unlinkSync = jest.fn();

    // Act
    await uploadCsvToDB(mockReq, mockRes);

    // Assert
    expect(csvParseFile).toHaveBeenCalledWith("test-path");
    expect(uploadCSV).toHaveBeenCalledWith("test-table", jsonArray);
    expect(RESPONSE.Created).toHaveBeenCalledWith(mockRes, {
      message: "Sucessfully uploaded the following files",
      data: response,
    });
    expect(fs.unlinkSync).toHaveBeenCalledWith("test-path");
  });

  it("should return status 500 if an error occurs", async () => {
    // Arrange
    mockReq.file = {
      originalname: "test-table",
      path: "test-path",
    };
    const error = new Error("test error");

    // Mock implementation
    uploadCSV.mockRejectedValue(error);
    fs.unlinkSync = jest.fn();

    // Act
    await uploadCsvToDB(mockReq, mockRes);

    // Assert
    expect(RESPONSE.ServerError).toHaveBeenCalledWith(mockRes, {
      message: error.message,
    });
  });
});

describe("fetchS3DataAndUploadToDB", () => {
  let mockReq;
  let mockRes;
  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // constants
  const objectList = {
    Contents: [
      {
        Key: "test-key",
        ETag: "test-tag",
      },
    ],
  };

  const jsonArray = [
    {
      attribute: "value",
      attribute2: "value2",
    },
    {
      attribute: "value",
      attribute2: "value2",
    },
  ];

  const response = {
    file: "test",
    table: "test-table",
  };

  // mock implementations

  it("should upload the files in the s3 bucket to the database", async () => {
    // Arrange

    // Mock implementation
    listS3Objects.mockResolvedValue(objectList);
    getObjectFilteredList.mockResolvedValue(objectList.Contents);
    csvParseStream.mockResolvedValue(jsonArray);
    isCSVFile.mockReturnValue(true);
    uploadCSV.mockResolvedValue(response);

    // Act
    await fetchS3DataAndUploadToDB(mockReq, mockRes);

    // Assert
    expect(listS3Objects).toHaveBeenCalled();
    expect(getObjectFilteredList).toHaveBeenCalledWith(objectList.Contents);
    expect(isCSVFile).toHaveBeenCalledWith(objectList.Contents[0].Key);
    expect(csvParseStream).toHaveBeenCalled();
    expect(uploadCSV).toHaveBeenCalledWith(
      objectList.Contents[0].Key,
      jsonArray
    );
    expect(addProcessedFiles).toHaveBeenCalledWith(
      objectList.Contents[0].Key,
      objectList.Contents[0].ETag
    );

    expect(RESPONSE.Created).toHaveBeenCalledWith(mockRes, {
      message: "Sucessfully uploaded the following files",
      data: [response],
    });
  });

  it("should upload only the csv files to the database", async () => {
    // Arrange

    // Mock implementation
    listS3Objects.mockResolvedValue(objectList);
    getObjectFilteredList.mockResolvedValue(objectList.Contents);
    isCSVFile.mockReturnValue(false);

    // Act
    await fetchS3DataAndUploadToDB(mockReq, mockRes);

    // Assert
    expect(RESPONSE.Created).toHaveBeenCalledWith(mockRes, {
      message: "Sucessfully uploaded the following files",
      data: [],
    });
  });

  it("incase of any error while parsing the files in the s3 bucket, it should skip that file and continue", async () => {
    // Arrange
    const newObjectList = {
      Contents: [
        {
          Key: "test-key",
          ETag: "test-tag",
        },
        {
          Key: "test-key2",
          ETag: "test-tag2",
          // error while uploading
        },
      ],
    };

    const error = new Error("error while parsing the file");

    // Mock implementation
    listS3Objects.mockResolvedValue(newObjectList);
    getObjectFilteredList.mockResolvedValue(newObjectList.Contents);
    isCSVFile.mockReturnValue(true);

    // error while parsing
    csvParseStream.mockResolvedValue(jsonArray);
    csvParseStream.mockRejectedValueOnce(error);

    uploadCSV.mockResolvedValue(response);

    // Act
    await fetchS3DataAndUploadToDB(mockReq, mockRes);

    // Assert
    expect(isCSVFile).toHaveBeenCalledTimes(2);
    expect(csvParseStream).toHaveBeenCalledTimes(2);
    expect(uploadCSV).toHaveBeenCalledTimes(1);
    expect(uploadCSV).toHaveBeenCalledWith(
      newObjectList.Contents[1].Key,
      jsonArray
    );
    expect(addProcessedFiles).toHaveBeenCalledWith(
      newObjectList.Contents[1].Key,
      newObjectList.Contents[1].ETag
    );

    expect(RESPONSE.Created).toHaveBeenCalledWith(mockRes, {
      message: "Sucessfully uploaded the following files",
      data: [response],
    });
  });

  it("incase of any error while uploading the files to db, it should skip that file and continue", async () => {
    // Arrange
    const newObjectList = {
      Contents: [
        {
          Key: "test-key",
          ETag: "test-tag",
        },
        {
          Key: "test-key2",
          ETag: "test-tag2",
          // error while uploading
        },
      ],
    };

    const error = new Error("error while uploading the file");

    // Mock implementation
    listS3Objects.mockResolvedValue(newObjectList);
    getObjectFilteredList.mockResolvedValue(newObjectList.Contents);
    isCSVFile.mockReturnValue(true);
    csvParseStream.mockResolvedValue(jsonArray);

    // error while uploading
    uploadCSV.mockResolvedValue(response);
    uploadCSV.mockRejectedValueOnce(error);

    // Act
    await fetchS3DataAndUploadToDB(mockReq, mockRes);

    // Assert
    expect(isCSVFile).toHaveBeenCalledTimes(2);
    expect(csvParseStream).toHaveBeenCalledTimes(2);
    expect(uploadCSV).toHaveBeenCalledTimes(2);
    expect(addProcessedFiles).toHaveBeenCalledTimes(1);
    expect(addProcessedFiles).toHaveBeenCalledWith(
      newObjectList.Contents[1].Key,
      newObjectList.Contents[1].ETag
    );

    expect(RESPONSE.Created).toHaveBeenCalledWith(mockRes, {
      message: "Sucessfully uploaded the following files",
      data: [response],
    });
  });

  it("should return empty list if there are no files in the s3 bucket", async () => {
    // Arrange
    const newObjectList = {
      Contents: [],
    };

    // Mock implementation
    listS3Objects.mockResolvedValue(newObjectList);
    getObjectFilteredList.mockResolvedValue(newObjectList.Contents);

    // Act
    await fetchS3DataAndUploadToDB(mockReq, mockRes);

    // Assert
    expect(isCSVFile).not.toHaveBeenCalled();
    expect(csvParseStream).not.toHaveBeenCalled();

    expect(RESPONSE.Created).toHaveBeenCalledWith(mockRes, {
      message: "Sucessfully uploaded the following files",
      data: [],
    });
  });

  it("should return status 500 if there is an error while fetching keylist or filtering the keylist", async () => {
    // Arrange
    const error = new Error("error while fetching file list from s3");

    // Mock implementation
    listS3Objects.mockRejectedValue(error);

    // Act
    await fetchS3DataAndUploadToDB(mockReq, mockRes);

    // Assert
    expect(getObjectFilteredList).not.toHaveBeenCalled();
    expect(isCSVFile).not.toHaveBeenCalled();
    expect(csvParseStream).not.toHaveBeenCalled();

    expect(RESPONSE.ServerError).toHaveBeenCalledWith(mockRes, {
      message: error.message,
    });
  });
});
