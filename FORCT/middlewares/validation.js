// bookValidation.js

// =======================================
// Import Joi, a powerful schema-based validation library for JavaScript.
// Used to define and enforce rules for data (e.g., ensuring required fields).
// =======================================
const Joi = require("joi");

// =======================================
// DEFINE: bookSchema
// A Joi validation schema used to validate book objects.
// This is primarily used for validating data on POST (create) and PUT (update) requests.
// =======================================
const bookSchema = Joi.object({
  // Title must be a non-empty string between 1 and 50 characters
  title: Joi.string().min(1).max(50).required().messages({
    "string.base": "Title must be a string", // If not a string
    "string.empty": "Title cannot be empty", // If empty string
    "string.min": "Title must be at least 1 character long", // If < 1 char
    "string.max": "Title cannot exceed 50 characters", // If > 50 chars
    "any.required": "Title is required", // If missing entirely
  }),

  // Author must also be a non-empty string between 1 and 50 characters
  author: Joi.string().min(1).max(50).required().messages({
    "string.base": "Author must be a string",
    "string.empty": "Author cannot be empty",
    "string.min": "Author must be at least 1 character long",
    "string.max": "Author cannot exceed 50 characters",
    "any.required": "Author is required",
  }),

  // OPTIONAL: You can add more fields here (e.g., genre, year) as needed.
});

// =====================================================
// MIDDLEWARE: validateBook
// PURPOSE: Validate the book data in the request body (used in POST/PUT routes)
//
// If validation fails, it returns a 400 error with all validation messages.
// Joi's `abortEarly: false` ensures all errors are collected instead of stopping at the first.
// =====================================================
function validateBook(req, res, next) {
  // Validate the incoming request body using the Joi schema
  const { error } = bookSchema.validate(req.body, { abortEarly: false });

  if (error) {
    // Format the array of validation errors into a single readable string
    const errorMessage = error.details
      .map((detail) => detail.message) // Extract each error message
      .join(", "); // Join messages into a single string

    // Respond with HTTP 400 Bad Request and the error details
    return res.status(400).json({ error: errorMessage });
  }

  // If validation passes, continue to the next middleware or route handler
  next();
}

// =====================================================
// MIDDLEWARE: validateBookId
// PURPOSE: Validate the `id` parameter in the URL for routes like GET /books/:id,
// PUT /books/:id, DELETE /books/:id.
//
// Ensures the ID is a valid positive number (integer).
// If not, returns a 400 error.
// =====================================================
function validateBookId(req, res, next) {
  // Parse the id from the request URL params
  const id = parseInt(req.params.id);

  // Validate that the ID is a positive integer (greater than 0)
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid book ID. ID must be a positive number",
    });
  }

  // If ID is valid, proceed to the next middleware or controller
  next();
}

// =====================================================
// EXPORT the validation middleware functions
// These are imported and used in the route definitions
// =====================================================
module.exports = {
  validateBook, // For validating request body on create/update
  validateBookId, // For validating :id route parameter
};
