const express = require("express"); // Web framework for building APIs and web servers -> Express.js
const sql = require("mssql"); // Microsoft SQL Server client for Node.js
const dotenv = require("dotenv"); // Loads environment variables from a .env file into process.env
const path = require("path"); // Node.js module for working with file and directory paths

dotenv.config(); // Loads environment variables from .env into process.env

const controller = require("./controllers/controller");

const { validateBook, validateBookId } = require("./middlewares/validation");

// Controllers: Handle actual request logic (e.g., interacting with the database and sending responses).

// Middleware: Validate request parameters or payloads before they reach the controller (used for error prevention and data integrity).

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Parses incoming JSON requests and puts parsed data in req.body
//This middleware reads incoming requests with JSON payloads (like API calls sending JSON data).
//It parses that JSON and puts the result into req.body.
//Example: If client sends { "name": "Alice" }, you can access it as req.body.name in your route.

app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data (from forms)
//This middleware parses URL-encoded form data — the kind browsers send from HTML forms.
//The option { extended: true } means it can handle rich objects and arrays in the form data.
//Example: If a form sends name=Alice&age=30, you access it as req.body.name and req.body.age.
//Rich objects here means you can send nested data structures via form fields, like:

app.use(express.static(path.join(__dirname, "public"))); // Serves static files from the "public" folder
//This serves static files like HTML, CSS, JavaScript, images, etc. from the public folder.
//When the browser requests /style.css, Express will look for public/style.css and serve it.
//Useful for serving frontend assets directly without extra route handlers.

// __dirname is a Node.js global variable that holds the absolute path of the directory where the current JavaScript file is located. It’s useful when you need to work with files or directories relative to your script’s location.

// This setup allows you to handle JSON, form data, and serve frontend assets (e.g., HTML, CSS, JS).
//

app.get("/books", controller.getAllBooks);
app.get("/books/:id", validateBookId, controller.getBookById);
app.post("/books", validateBook, controller.createBook);
app.put("/books/:id", validateBookId, validateBook, controller.updateBook);
app.delete("/books/:id", validateBookId, controller.deleteBook);
// validateBookId: Ensures :id parameter is valid before proceeding.
// validateBook: Ensures request body contains valid book data.

process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close(); // Closes all open SQL connections
  console.log("Database connections closed");
  process.exit(0); // Exit the process cleanly
});
// Ensures that when the server is stopped (e.g., Ctrl+C), database connections are properly closed to prevent leaks or hanging processes.

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
