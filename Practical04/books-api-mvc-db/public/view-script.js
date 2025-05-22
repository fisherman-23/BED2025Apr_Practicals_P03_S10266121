const apiBaseUrl = "http://localhost:3000";

window.addEventListener("DOMContentLoaded", async () => {
  const bookDetails = document.getElementById("bookDetails");

  // Get ID from URL query string, e.g., ?id=2
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id");

  if (!bookId) {
    bookDetails.textContent = "No book ID provided in the URL.";
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`);
    const contentType = response.headers.get("content-type");

    const responseBody = contentType?.includes("application/json")
      ? await response.json()
      : { message: response.statusText };

    if (response.ok) {
      bookDetails.innerHTML = `
        <h2>${responseBody.title}</h2>
        <p><strong>Author:</strong> ${responseBody.author}</p>
        <p><strong>ID:</strong> ${responseBody.id}</p>
      `;
    } else {
      bookDetails.textContent = responseBody.message || "Failed to fetch book.";
    }
  } catch (error) {
    bookDetails.textContent = "Error: " + error.message;
  }
});
