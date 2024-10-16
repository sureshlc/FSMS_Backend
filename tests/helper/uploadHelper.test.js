// Mock modules
jest.mock("../../utils/jsonUtils", () => {
  return {
    getDbUploadJsonArray: jest.fn(),
  };
});

jest.mock("../../utils/tableUtils", () => {
  return {
    getTableDetails: jest.fn(),
  };
});

jest.mock("../../services/dbService", () => {
  return {
    dbBulkCreate: jest.fn(),
  };
});

jest.mock("../../models/index.model", () => {
  return {
    MANIFEST: {
      findAll: jest.fn(),
      create: jest.fn(),
    },
  };
});
// Import modules
const { TableDetails } = require("../../models/entities/TableDetails");
const { dbBulkCreate } = require("../../services/dbService");
const { getDbUploadJsonArray } = require("../../utils/jsonUtils");
const { getTableDetails } = require("../../utils/tableUtils");
const {
  uploadCSV,
  getObjectFilteredList,
  addProcessedFiles,
  isCSVFile,
} = require("../../helper/uploadHelper");
const DB_MODEL = require("../../models/index.model");

describe("uploadCSV", () => {
  // constants
  const tableDetails = new TableDetails("tableName", jest.fn(), "category");
  const transformJsonArray = [
    {
      column1: "value",
      column2: "value",
    },
    {
      column1: "value1",
      column2: "value1",
    },
    {
      column1: "value1",
      column2: "value1",
    },
  ];

  it("should upload a CSV file to the database and return response", async () => {
    // Arrange
    const inputTableName = "tableName";
    const inputJsonArray = [
      {
        attribute1: "value",
        attribute2: "value",
        attribute3: "value",
      },
      {
        attribute1: "value1",
        attribute2: "value1",
        attribute3: "value1",
      },
    ];

    // Mock implementation
    getTableDetails.mockReturnValue(tableDetails);
    getDbUploadJsonArray.mockReturnValue(transformJsonArray);
    dbBulkCreate.mockResolvedValue();

    // Act
    const response = await uploadCSV(inputTableName, inputJsonArray);

    // Assert
    expect(getTableDetails).toHaveBeenCalledWith(inputTableName);
    expect(getDbUploadJsonArray).toHaveBeenCalledWith(
      tableDetails,
      inputJsonArray
    );
    expect(dbBulkCreate).toHaveBeenCalledWith(
      tableDetails._tableModel,
      transformJsonArray
    );
    expect(response).toEqual({
      file: inputTableName,
      table: tableDetails._tableName,
    });
  });
});

describe("getObjectFilteredList", () => {
  // constants
  const processedFiles = [{ tag: "1" }, { tag: "2" }];

  it("should return a filtered list of objects by removing the ones that are already processed", async () => {
    // Arrange
    const objectList = [{ ETag: "1" }, { ETag: "2" }, { ETag: "3" }];

    // Mock implementation
    DB_MODEL.MANIFEST.findAll.mockResolvedValue(processedFiles);

    // Act
    const filteredObjectList = await getObjectFilteredList(objectList);

    // Assert
    expect(DB_MODEL.MANIFEST.findAll).toHaveBeenCalled();
    expect(filteredObjectList).toEqual([{ ETag: "3" }]);
  });
});

describe("addProcessedFiles", () => {
  it("should add processed files to the manifest database", async () => {
    // Arrange
    const name = "file-name";
    const tag = "file-tag";

    // Act
    await addProcessedFiles(name, tag);

    // Assert
    expect(DB_MODEL.MANIFEST.create).toHaveBeenCalledWith({
      name,
      tag,
    });
  });
});

describe("isCSVFile", () => {
  it("should return true for CSV files", () => {
    // Arrange
    const csvFileName = "example.csv";
    // Act
    const result = isCSVFile(csvFileName);
    // Assert
    expect(result).toBe(true);
  });

  it("should return true for Excel files", () => {
    // Arrange
    const excelFileName = "example.xlsx";
    // Act
    const result = isCSVFile(excelFileName);
    // Assert
    expect(result).toBe(true);
  });

  it("should return false for non-CSV and non-Excel files", () => {
    // Arrange
    const txtFileName = "example.txt";
    // Act
    const result = isCSVFile(txtFileName);
    // Assert
    expect(result).toBe(false);
  });
});
