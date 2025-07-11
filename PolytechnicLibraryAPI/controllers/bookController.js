const bookModel = require("../models/bookModel");

// Get all books
async function getAllBooks(req, res) {
  try {
    const books = await bookModel.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving books" });
  }
}

async function updateBookAvailability(req, res) {
  try {
    const bookId = parseInt(req.params.id);
    const availability = req.body.availability;


    const updatedBook = await bookModel.updateBookAvailability(bookId, availability);
    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error updating book availability" });
  }
}


// Get book by ID
async function getBookById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const book = await bookModel.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error retrieving book" });
  }
}

// Create new book
async function createBook(req, res) {
  try {
    const newBook = await bookModel.createBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error creating book" });
  }
}

async function updateBook(req, res) {
    try {
        const id = parseInt(req.params.id);
        const updatedBook = await bookModel.updateBook(id, req.body);
        if (!updatedBook) {
        return res.status(404).json({ error: "Book not found" });
        }
    
        res.json(updatedBook);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error updating book" });
    }
}

async function deleteBook(req, res) {
    try {
        const id = parseInt(req.params.id);
        const deletedBook = await bookModel.deleteBook(id);
        if (!deletedBook) {
        return res.status(404).json({ error: "Book not found" });
        }
    
        res.status(204).send(); // No content
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error deleting book" });
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