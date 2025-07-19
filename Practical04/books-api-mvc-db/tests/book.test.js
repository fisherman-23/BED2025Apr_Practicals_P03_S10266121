// book.test.js
const Book = require("../models/bookModel");
const sql = require("mssql");

jest.mock("mssql"); // Mock the mssql library

describe("Book.getAllBooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all books from the database", async () => {
    const mockBooks = [
      {
        id: 1,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        availability: "Y",
      },
      {
        id: 2,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        availability: "N",
      },
    ];

    const mockRequest = {
      query: jest.fn().mockResolvedValue({ recordset: mockBooks }),
    };
    const mockConnection = {
      request: jest.fn().mockReturnValue(mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    };

    sql.connect.mockResolvedValue(mockConnection); // Return the mock connection

    const books = await Book.getAllBooks();

    expect(sql.connect).toHaveBeenCalledWith(expect.any(Object));
    expect(mockConnection.close).toHaveBeenCalledTimes(1);
    expect(books).toHaveLength(2);
    expect(books[0].id).toBe(1);
    expect(books[0].title).toBe("The Lord of the Rings");
    expect(books[0].author).toBe("J.R.R. Tolkien");
    expect(books[0].availability).toBe("Y");
    // ... Add assertions for the second book
  });

  it("should handle errors when retrieving books", async () => {
    const errorMessage = "Database Error";
    sql.connect.mockRejectedValue(new Error(errorMessage));
    await expect(Book.getAllBooks()).rejects.toThrow(errorMessage);
  });
});

// book.test.js (continue in the same file)
describe("Book.updateBookAvailability", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

  it("should update the availability of a book", async () => {
    const bookId = 1;
    const isAvailable = "N";

    // Mock what the query will return
    const mockQuery = jest.fn().mockResolvedValue({ 
        rowsAffected: [1] ,
        recordset: [{ id: 1, title: "Mock Book", availability: "N" }]
    });

    // Mock the SQL request object
    const mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: mockQuery,
    };

    const mockConnection = {
      request: jest.fn(() => mockRequest),
      close: jest.fn(),
    };

    sql.connect.mockResolvedValue(mockConnection);
    const result = await Book.updateBookAvailability(bookId, isAvailable);
    expect(mockRequest.input).toHaveBeenCalledWith("isAvailable", isAvailable);
    expect(mockRequest.input).toHaveBeenCalledWith("bookId", bookId);
    expect(result).toEqual({ id: 1, title: "Mock Book", availability: "N" });
  });

  it("should return null if book with the given id does not exist", async () => {
    const bookId = 0;
    const isAvailable = "Y";

    const mockQuery = jest.fn().mockResolvedValue({ rowsAffected: [0] });

    const mockRequest = {
        input: jest.fn().mockReturnThis(),
        query: mockQuery,
    };

    const mockConnection = {
        request: jest.fn(() => mockRequest),
        close: jest.fn(),
    };

    sql.connect.mockResolvedValue(mockConnection);

    const result = await Book.updateBookAvailability(bookId, isAvailable);

    // We expect the function to return null
    expect(result).toBeNull();
  });

  // Add more tests for error scenarios (e.g., database error)
});