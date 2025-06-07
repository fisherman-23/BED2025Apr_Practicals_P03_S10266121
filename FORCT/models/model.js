// bookController.js

// Import the mssql library to interact with Microsoft SQL Server
const sql = require("mssql");

// Import database configuration (username, password, host, etc.)
const dbConfig = require("../dbConfig");

// ============================================================
// FUNCTION: getAllBooks
// PURPOSE: Fetch all books from the Books table.
// RETURNS: Array of objects, each with `id`, `title`, and `author`.
// ============================================================
async function getAllBooks() {
  let connection;
  try {
    // Establish a connection to the SQL Server using dbConfig
    connection = await sql.connect(dbConfig);

    // SQL query to select all books with specific columns
    const query = "SELECT id, title, author FROM Books";

    // Execute the query using a request object
    const result = await connection.request().query(query);

    // result.recordset contains an array of row objects from the query
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error; // Re-throw to be handled by the controller
  } finally {
    // Ensure the DB connection is closed, even if an error occurs
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// ============================================================
// FUNCTION: getBookById
// PURPOSE: Fetch a single book by its ID.
// PARAMS:
//   - id: number (Book ID to fetch)
// RETURNS: The book object if found; otherwise, null.
// ============================================================
async function getBookById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);

    // Parameterized SQL query to avoid SQL injection.
    // '@id' is a placeholder for a value passed separately via .input()
    const query = "SELECT id, title, author FROM Books WHERE id = @id";

    const request = connection.request();
    request.input("id", sql.Int, id); // Bind actual value to the placeholder

    const result = await request.query(query);

    // If the query returns no rows, return null
    if (result.recordset.length === 0) {
      return null;
    }

    // Return the first (and only) result
    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// ============================================================
// FUNCTION: createBook
// PURPOSE: Inserts a new book into the database.
// PARAMS:
//   - bookData: object with `title` and `author` properties
// RETURNS: The full book object just created, including its ID.
// ============================================================
async function createBook(bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);

    // SQL query to insert a new book.
    // '@title' and '@author' are placeholders.
    // 'SCOPE_IDENTITY()' returns the ID of the last inserted row
    // in the current session and scope (safe way to get the new ID).
    const query = `
      INSERT INTO Books (title, author)
      VALUES (@title, @author);
      SELECT SCOPE_IDENTITY() AS id; -- Gets the ID of the inserted book
    `;

    const request = connection.request();
    request.input("title", sql.NVarChar, bookData.title); // Bind @title
    request.input("author", sql.NVarChar, bookData.author); // Bind @author

    const result = await request.query(query);

    // Extract the newly generated book ID from the query result
    const newBookId = result.recordset[0].id;

    // Use the getBookById function to fetch the full record (to return)
    return await getBookById(newBookId);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// ============================================================
// FUNCTION: updateBook
// PURPOSE: Updates an existing book's title and author by ID.
// PARAMS:
//   - id: number (Book ID to update)
//   - bookData: object with new `title` and `author`
// RETURNS: Updated book object if successful; null if book not found.
// ============================================================
async function updateBook(id, bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);

    // SQL query to update a book with the provided ID
    const query = `
      UPDATE Books
      SET title = @title, author = @author
      WHERE id = @id
    `;

    const request = connection.request();
    request.input("id", sql.Int, id); // Bind ID
    request.input("title", sql.NVarChar, bookData.title); // Bind title
    request.input("author", sql.NVarChar, bookData.author); // Bind author

    const result = await request.query(query);

    // If no rows were updated, the book with that ID doesn't exist
    if (result.rowsAffected[0] === 0) {
      return null;
    }

    // Fetch and return the updated book
    return await getBookById(id);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// ============================================================
// FUNCTION: deleteBook
// PURPOSE: Removes a book by its ID from the database.
// PARAMS:
//   - id: number (Book ID to delete)
// RETURNS: A success message if deleted; null if not found.
// ============================================================
async function deleteBook(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);

    // SQL query to delete a book based on its ID
    const query = "DELETE FROM Books WHERE id = @id";

    const request = connection.request();
    request.input("id", sql.Int, id); // Bind the book ID

    const result = await request.query(query);

    // If no rows were deleted, return null
    if (result.rowsAffected[0] === 0) {
      return null;
    }

    // Return a confirmation message
    return { message: "Book deleted successfully" };
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// ============================================================
// EXPORTS
// Make all controller functions available to other modules (e.g., routes)
// ============================================================
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
