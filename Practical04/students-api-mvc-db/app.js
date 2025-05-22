const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const path = require("path");
// Load environment variables
dotenv.config();

const studentController = require("./controllers/studentController");
const {
  validateStudent,
  validateStudentId,
} = require("./middlewares/studentValidation"); // import Student Validation Middleware

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware (Parsing request bodies)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for serving static files
app.use(express.static(path.join(__dirname, "public")));

// Routes for students
app.get("/students", studentController.getAllStudents);
app.get("/students/:id", validateStudentId, studentController.getStudentById);
app.post("/students", validateStudent, studentController.createStudent);
app.put(
  "/students/:id",
  validateStudentId,
  validateStudent,
  studentController.updateStudent
);
app.delete("/students/:id", validateStudentId, studentController.deleteStudent);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connections closed");
  process.exit(0);
});
