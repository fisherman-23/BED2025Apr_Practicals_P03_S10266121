const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all books
async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT book_id, title, author, availability FROM Books";
    const result = await connection.request().query(query);
    return result.recordset;
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

async function updateBookAvailability(bookId, isAvailable) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `UPDATE Books SET availability = @isAvailable WHERE book_id = @bookId`;
    const request = connection.request();
    request.input("isAvailable", isAvailable);
    request.input("bookId", bookId);
    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return null; // If no rows were affected, the book may not exist
    }
    return await getBookById(bookId); // Return the updated book

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

// Get book by ID
async function getBookById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT book_id, title, author, availability FROM Books WHERE book_id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Book not found
    }

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

// Create new book
async function createBook(bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO Books (title, author) VALUES (@title, @author); SELECT SCOPE_IDENTITY() AS id;";
    const request = connection.request();
    request.input("title", bookData.title);
    request.input("author", bookData.author);
    const result = await request.query(query);

    const newBookId = result.recordset[0].id;
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

async function updateBook(id, bookData) {
    let connection
    try {
        connection = await sql.connect(dbConfig)
        const sqlQuery = `UPDATE Books SET title = @title, author = @author WHERE id = @id`
        const request = connection.request()
        request.input("id", id)
        request.input("title", bookData.title)
        request.input("author", bookData.author)
        const result = await request.query(sqlQuery)

        if (result.rowsAffected[0] === 0) {
            return null // If there are no changes to the database, return null
        }    
        return await getBookById(id);
    } catch (error) {
        console.error("Database error:", error)
        throw error
    } finally {
        if (connection) {
            try {
                await connection.close()
            } catch (err) {
                console.error("Error closing connection:", err)
            }
        }
    }
}

async function deleteBook(id) {
    const bookToDelete = await getBookById(id);
    let connection
    try {
        connection = await sql.connect(dbConfig)

        const sqlQuery = `DELETE FROM Books WHERE id = @id`
        const request = connection.request()
        request.input("id", id)
        const result = await request.query(sqlQuery)

        if (result.rowsAffected[0] === 0) {
            return null // If there are no changes to the database, return null
        }
        return bookToDelete;
    } catch (error) {
        console.error("Database error:", error)
        throw error
    } finally {
        if (connection) {
            try {
                await connection.close()
            } catch (err) {
                console.error("Error closing connection:", err)
            }
        }
    }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  updateBookAvailability
};