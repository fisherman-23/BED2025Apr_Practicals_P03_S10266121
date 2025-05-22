const Joi = require("joi"); // Import Joi for validation

// Validation schema for students (used for POST/PUT)
const studentSchema = Joi.object({
  name: Joi.string().min(1).max(50).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name cannot exceed 50 characters",
    "any.required": "Name is required",
  }),
  address: Joi.string().min(1).max(100).required().messages({
    "string.base": "Address must be a string",
    "string.empty": "Address cannot be empty",
    "string.min": "Address must be at least 1 character long",
    "string.max": "Address cannot exceed 100 characters",
    "any.required": "Address is required",
  }),
  // Add validation for other fields if necessary
});

// Middleware to validate student data (for POST/PUT)
function validateStudent(req, res, next) {
  const { error } = studentSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res.status(400).json({ error: errorMessage });
  }

  next();
}

// Middleware to validate student ID from URL parameters
function validateStudentId(req, res, next) {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: "Invalid student ID. ID must be a positive number",
    });
  }

  next();
}

module.exports = {
  validateStudent,
  validateStudentId,
};
