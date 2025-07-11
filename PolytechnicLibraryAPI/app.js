const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const bookController = require('./controllers/bookController');
const {
  validateBook,
  validateBookId,
} = require('./middlewares/bookValidation');

const userController = require('./controllers/userController');
const {
  validateUser,
  validateUserId,
  validateUserRegistration,
  validateLogin
} = require('./middlewares/userValidation');

const {
  verifyJWT
} = require('./utils/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/books', verifyJWT, bookController.getAllBooks);
app.put('/books/:id', verifyJWT, validateBookId, bookController.updateBookAvailability);
app.post('/register', validateUserRegistration, userController.registerUser);
app.post('/login', validateLogin, userController.loginUser);
app.put('/books/:id/availability', verifyJWT, validateBookId, bookController.updateBookAvailability);


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