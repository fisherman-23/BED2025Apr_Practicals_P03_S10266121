// bookController.js

// Import the bookModel which contains all database interaction logic for books
const bookModel = require("../models/model");

/**
 * Controller: Get All Books
 * Route: GET /books
 * Description:
 * - Retrieves all books from the database using the bookModel.
 * - Returns a JSON array of books or a 500 error if something goes wrong.
 */
async function getAllBooks(req, res) {
  try {
    const books = await bookModel.getAllBooks(); // Call model function to fetch all books
    res.json(books); // Return array of books as JSON
  } catch (error) {
    console.error("Controller error:", error); // Log internal error (for debugging)
    res.status(500).json({ error: "Error retrieving books" }); // Send generic error to client
  }
}

/**
 * Controller: Get Book by ID
 * Route: GET /books/:id
 * Description:
 * - Retrieves a single book by its ID.
 * - If not found, returns 404. Otherwise, returns the book object.
 */
async function getBookById(req, res) {
  try {
    const id = parseInt(req.params.id); // Get `id` from URL parameters and convert to integer
    const book = await bookModel.getBookById(id); // Query DB using model
    if (!book) {
      // If book not found, respond with 404
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book); // If found, return book object
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving book" });
  }
}

/**
 * Controller: Create a New Book
 * Route: POST /books
 * Description:
 * - Creates a new book in the database using data from the request body.
 * - Returns the newly created book with its ID and data.
 */
async function createBook(req, res) {
  try {
    const newBook = await bookModel.createBook(req.body); // Create new book using model
    res.status(201).json(newBook); // 201 Created + return book details
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating book" });
  }
}

/**
 * Controller: Update Existing Book by ID
 * Route: PUT /books/:id
 * Description:
 * - Updates an existing book's title and author using the request body.
 * - Returns updated book if found, otherwise 404.
 */
async function updateBook(req, res) {
  try {
    const id = parseInt(req.params.id); // Extract and convert ID
    const updatedBook = await bookModel.updateBook(id, req.body); // Update book via model
    if (!updatedBook) {
      // If no rows affected, book with given ID doesn't exist
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(updatedBook); // Return updated book
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating book" });
  }
}

/**
 * Controller: Delete Book by ID
 * Route: DELETE /books/:id
 * Description:
 * - Deletes a book by ID.
 * - Returns 204 (No Content) on success, 404 if book is not found.
 */
async function deleteBook(req, res) {
  try {
    const id = parseInt(req.params.id); // Extract ID from params
    if (isNaN(id) || id <= 0) {
      // Validate ID format
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const deletedBook = await bookModel.deleteBook(id); // Attempt to delete book
    if (!deletedBook) {
      // If book didn't exist
      return res.status(404).json({ error: "Book not found" });
    }

    // Success: Book deleted — 204 status means "No Content"
    res.status(204).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error deleting book" });
  }
}

// Export all controller functions to be used in routes
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
