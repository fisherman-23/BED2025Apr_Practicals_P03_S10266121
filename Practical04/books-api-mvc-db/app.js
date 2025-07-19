const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

// Load environment variables
dotenv.config();

const bookController = require("./controllers/bookController");
const userController = require("./controllers/userController");
const {
  validateBook,
  validateBookId,
} = require("./middlewares/bookValidation"); // import Book Validation Middleware

const {
  validateUser,
  validateUserId,
} = require("./middlewares/userValidation"); // import User Validation Middleware

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware (Parsing request bodies)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
// --- Add other general middleware here (e.g., logging, security headers) ---

// Middleware for serving static files
app.use(express.static(path.join(__dirname, "public")));

// Routes for books
// Apply middleware *before* the controller function for routes that need it
app.get("/books", bookController.getAllBooks);
app.get("/books/:id", validateBookId, bookController.getBookById); // Use validateBookId middleware
app.post("/books", validateBook, bookController.createBook); // Use validateBook middleware

// Routes for PUT and DELETE
app.put("/books/:id", validateBookId, validateBook, bookController.updateBook); // Use validateBookId and validateBook middleware
app.delete("/books/:id", validateBookId, bookController.deleteBook); // Use validateBookId middleware
// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Routes for users
// Important for the following route to be defined before the others
app.get("/users/search", userController.searchUsers);
app.get("/users/with-books", userController.getUsersWithBooks);
app.post("/users", validateUser, userController.createUser); // Use validateUser middleware
app.get("/users", userController.getAllUsers);
app.get("/users/:id", validateUserId, userController.getUserById); // Use validateUserId middleware
app.put("/users/:id", validateUserId, validateUser, userController.updateUser); // Use validateUserId and validateUser middleware
app.delete("/users/:id", validateUserId, userController.deleteUser); // Use validateUserId middleware
// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
});
