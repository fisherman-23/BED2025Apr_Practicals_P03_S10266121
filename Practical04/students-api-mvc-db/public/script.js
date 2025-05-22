// Get references to the HTML elements you'll interact with:
const studentsListDiv = document.getElementById("studentsList");
const fetchStudentsBtn = document.getElementById("fetchStudentsBtn");
const messageDiv = document.getElementById("message");
const apiBaseUrl = "http://localhost:3000";

// Function to fetch students from the API and display them
async function fetchStudents() {
  try {
    studentsListDiv.innerHTML = "Loading students...";
    messageDiv.textContent = "";

    const response = await fetch(`${apiBaseUrl}/students`);

    if (!response.ok) {
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    const students = await response.json();

    studentsListDiv.innerHTML = "";
    if (students.length === 0) {
      studentsListDiv.innerHTML = "<p>No students found.</p>";
    } else {
      students.forEach((student) => {
        const studentElement = document.createElement("div");
        studentElement.classList.add("student-item");
        studentElement.setAttribute("data-student-id", student.student_id);
        studentElement.innerHTML = `
          <h3>${student.name}</h3>
          <p>Address: ${student.address}</p>
          <p>ID: ${student.student_id}</p>
          <button onclick="editStudent(${student.student_id})">Edit</button>
          <button class="delete-btn" data-id="${student.student_id}">Delete</button>
        `;
        studentsListDiv.appendChild(studentElement);
      });

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    studentsListDiv.innerHTML = `<p style="color: red;">Failed to load students: ${error.message}</p>`;
  }
}

// Redirect to view details
function viewStudentDetails(studentId) {
  console.log("View details for student ID:", studentId);
  window.location.href = `student-view.html?id=${studentId}`;
}

// Redirect to edit
function editStudent(studentId) {
  console.log("Edit student with ID:", studentId);
  window.location.href = `edit-student.html?id=${studentId}`;
}

// Handle delete
async function handleDeleteClick(event) {
  const studentId = event.target.getAttribute("data-id");
  console.log("Attempting to delete student with ID:", studentId);

  const response = await fetch(`${apiBaseUrl}/students/${studentId}`, {
    method: "DELETE",
  });

  const responseBody = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? await response.json()
    : { message: response.statusText };

  if (response.status === 204) {
    const studentElement = event.target.closest(".student-item");
    if (studentElement) {
      studentElement.remove();
    }
    messageDiv.textContent = "Student deleted successfully!";
    messageDiv.style.color = "green";
  } else if (response.status === 404) {
    messageDiv.textContent = "Error: Student not found.";
    messageDiv.style.color = "red";
  } else {
    messageDiv.textContent = `Failed to delete student: ${responseBody.message}`;
    messageDiv.style.color = "red";
  }
}

// Event listener to fetch students on button click
fetchStudentsBtn.addEventListener("click", fetchStudents);
