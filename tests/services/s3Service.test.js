const {
  listS3Objects,
  getS3Object,
  getS3ObjectStream,
} = require("../../services/s3Service");

// Mocking AWS S3 client
const mockS3Client = {
  listObjectsV2: jest.fn(),
  getObject: jest.fn(),
};

describe("listS3Objects", () => {
  it("should return a list of S3 objects", async () => {
    // Arrange
    const listObjectRequest = { Bucket: "test-bucket" };
    const mockListResponse = {
      Contents: [{ Key: "file1.txt" }, { Key: "file2.txt" }],
    };

    // Mock Implementation
    mockS3Client.listObjectsV2.mockReturnValueOnce({
      promise: () => Promise.resolve(mockListResponse),
    });

    // Act
    const result = await listS3Objects(mockS3Client, listObjectRequest);

    // Assert
    expect(result).toEqual(mockListResponse);
    expect(mockS3Client.listObjectsV2).toHaveBeenCalledWith(listObjectRequest);
  });

  it("should throw an error if listing S3 objects fails", async () => {
    // Arrange
    const listObjectRequest = { Bucket: "test-bucket" };
    const mockError = new Error("Listing error");

    // Mock Implementation
    mockS3Client.listObjectsV2.mockReturnValueOnce({
      promise: () => Promise.reject(mockError),
    });

    // Assert
    await expect(
      listS3Objects(mockS3Client, listObjectRequest)
    ).rejects.toThrow(mockError);
    expect(mockS3Client.listObjectsV2).toHaveBeenCalledWith(listObjectRequest);
  });
});

describe("getS3Object", () => {
  it("should return an S3 object", async () => {
    // Arrange
    const getObjectRequest = { Bucket: "test-bucket", Key: "file.txt" };
    const mockGetResponse = { Body: "file content" };

    // Mock Implementation
    mockS3Client.getObject.mockReturnValueOnce({
      promise: () => Promise.resolve(mockGetResponse),
    });

    // Act
    const result = await getS3Object(mockS3Client, getObjectRequest);

    // Assert
    expect(result).toEqual(mockGetResponse);
    expect(mockS3Client.getObject).toHaveBeenCalledWith(getObjectRequest);
  });

  it("should throw an error if getting S3 object fails", async () => {
    // Arrange
    const getObjectRequest = { Bucket: "test-bucket", Key: "file.txt" };
    const mockError = new Error("Get error");

    // Mock Implementation
    mockS3Client.getObject.mockReturnValueOnce({
      promise: () => Promise.reject(mockError),
    });

    // Assert
    await expect(getS3Object(mockS3Client, getObjectRequest)).rejects.toThrow(
      mockError
    );
    expect(mockS3Client.getObject).toHaveBeenCalledWith(getObjectRequest);
  });
});

describe("getS3ObjectStream", () => {
  it("should return a readable stream for an S3 object", async () => {
    // Arrange
    const getObjectRequest = { Bucket: "test-bucket", Key: "file.txt" };
    const mockStream = {}; // Mock readable stream

    // Mock Implementation
    mockS3Client.getObject.mockReturnValueOnce({
      createReadStream: () => mockStream,
    });

    // Act
    const result = await getS3ObjectStream(mockS3Client, getObjectRequest);

    // Assert
    expect(result).toBe(mockStream);
    expect(mockS3Client.getObject).toHaveBeenCalledWith(getObjectRequest);
  });

  it("should throw an error if getting S3 object stream fails", async () => {
    // Arrange
    const getObjectRequest = { Bucket: "test-bucket", Key: "file.txt" };
    const mockError = new Error("Stream error");

    // Mock Implementation
    mockS3Client.getObject.mockReturnValue({
      createReadStream: jest.fn().mockRejectedValueOnce(mockError),
    });

    // Assert
    await expect(
      getS3ObjectStream(mockS3Client, getObjectRequest)
    ).rejects.toThrow(mockError);
    expect(mockS3Client.getObject).toHaveBeenCalledWith(getObjectRequest);
  });
});
