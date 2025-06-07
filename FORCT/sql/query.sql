-- Switch to the target database
USE bed_db;
GO

-- ========================================================
-- 📦 Table: Users
-- Stores basic user information.
-- Each user has a unique ID, username, and email.
-- ========================================================
CREATE TABLE Users (
  id INT PRIMARY KEY IDENTITY,         -- Auto-incrementing unique ID
  username VARCHAR(50) NOT NULL UNIQUE, -- Username must be unique and non-null
  email VARCHAR(100) NOT NULL UNIQUE    -- Email must be unique and non-null
);

-- ========================================================
-- 📦 Table: UserBooks
-- Junction table for many-to-many relationship between
-- Users and Books. Each record links a user to a book.
-- ========================================================
CREATE TABLE UserBooks (
  id INT PRIMARY KEY IDENTITY,              -- Unique ID for each association
  user_id INT FOREIGN KEY REFERENCES Users(id), -- References a valid user
  book_id INT FOREIGN KEY REFERENCES Books(id)  -- References a valid book
);

-- ========================================================
-- 📘 Insert Sample Books
-- Adds some initial books into the Books table.
-- Assumes the Books table is already created elsewhere.
-- ========================================================
INSERT INTO Books (title, author)
VALUES
  ('To Kill a Mockingbird', 'Harper Lee'),
  ('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams'), -- Note: '' escapes the single quote
  ('Dune', 'Frank Herbert'),
  ('The Great Gatsby', 'F. Scott Fitzgerald');

-- ========================================================
-- 👤 Insert Sample Users
-- Adds example users into the Users table
-- ========================================================
INSERT INTO Users (username, email)
VALUES
  ('user1', 'user1@example.com'),
  ('user2', 'user2@example.com'),
  ('user3', 'user3@example.com');

-- ========================================================
-- 🔁 Reset & Clean UserBooks table
-- 1. Deletes all current user-book relationships
-- 2. Resets identity counter (so new IDs start from 1 again)
-- ========================================================
DELETE FROM UserBooks;
DBCC CHECKIDENT ('UserBooks', RESEED, 0); -- Resets auto-incrementing ID

-- ========================================================
-- 📚 Insert User-Book Relationships
-- These entries link users to the books they own or have borrowed.
-- Each row associates a user_id with a book_id
-- Make sure these IDs exist in Users and Books tables.
-- ========================================================
INSERT INTO UserBooks (user_id, book_id)
VALUES
  (1, 1),  -- User 1 owns book 1
  (1, 2),  -- User 1 owns book 2
  (1, 4),  -- User 1 owns book 4
  (2, 3),  -- User 2 owns book 3
  (2, 5),  -- User 2 owns book 5
  (3, 1),  -- User 3 also owns book 1
  (3, 6);  -- User 3 owns book 6

-- ========================================================
-- 🧪 View Final Tables
-- These queries show the data in each table.
-- Useful for verification and debugging.
-- ========================================================
SELECT * FROM Books;
SELECT * FROM Users;
SELECT * FROM UserBooks;
