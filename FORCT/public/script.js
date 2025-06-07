// public/script.js

// Function to fetch all books from the backend and display them on the page
async function fetchBooks() {
  try {
    // Send GET request to /books API
    const response = await fetch("/books");
    const books = await response.json(); // Parse response as JSON

    // Get reference to the book list container in HTML
    const listDiv = document.getElementById("book-list");
    listDiv.innerHTML = ""; // Clear existing list to prevent duplication

    // Loop through the array of books and create a new <div> for each
    books.forEach((book) => {
      const div = document.createElement("div");
      div.className = "book"; // Apply CSS class for styling (optional)
      div.textContent = `ID: ${book.id}, Title: ${book.title}, Author: ${book.author}`;
      listDiv.appendChild(div); // Add the book div to the container
    });
  } catch (err) {
    console.error("Error fetching books:", err);
  }
}

// Function to add a new book via the form input fields
async function addBook() {
  // Get values from the input fields
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();

  // Basic front-end validation to ensure both fields are filled
  if (!title || !author) {
    alert("Both title and author are required.");
    return;
  }

  try {
    // Send POST request to /books API with book data in JSON format
    const response = await fetch("/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author }), // Convert JS object to JSON string
    });

    // Handle error responses
    if (!response.ok) {
      const err = await response.json();
      alert("Error: " + err.error);
      return;
    }

    // On success: reset form fields and refresh book list
    alert("Book added successfully!");
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    fetchBooks(); // Refresh the book list
  } catch (err) {
    console.error("Error adding book:", err);
  }
}

// Function to delete a book based on an ID entered by the user
async function deleteBook() {
  // Get the ID entered in the input field
  const id = document.getElementById("delete-id").value.trim();

  // Validate that the ID is a positive number
  if (!id || isNaN(id) || Number(id) <= 0) {
    alert("Enter a valid book ID");
    return;
  }

  try {
    // Send DELETE request to /books/:id
    const response = await fetch(`/books/${id}`, {
      method: "DELETE",
    });

    // Handle various responses
    if (response.status === 404) {
      alert("Book not found.");
    } else if (response.ok) {
      alert("Book deleted.");
      fetchBooks(); // Refresh the book list
    } else {
      const err = await response.json();
      alert("Error: " + err.error);
    }
  } catch (err) {
    console.error("Error deleting book:", err);
  }
}

// Automatically load all books when the page is loaded
window.onload = fetchBooks;
