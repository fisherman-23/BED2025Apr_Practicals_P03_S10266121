// Get references to the elements
const editStudentForm = document.getElementById("editStudentForm");
const loadingMessageDiv = document.getElementById("loadingMessage");
const messageDiv = document.getElementById("message");
const studentIdInput = document.getElementById("studentId");
const editNameInput = document.getElementById("editName");
const editAddressInput = document.getElementById("editAddress");

const apiBaseUrl = "http://localhost:3000";

// Function to get student ID from URL query parameter
function getStudentIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Function to fetch existing student data
async function fetchStudentData(studentId) {
  try {
    const response = await fetch(`${apiBaseUrl}/students/${studentId}`);

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

    const student = await response.json();
    return student;
  } catch (error) {
    console.error("Error fetching student data:", error);
    messageDiv.textContent = `Failed to load student data: ${error.message}`;
    messageDiv.style.color = "red";
    loadingMessageDiv.textContent = "";
    return null;
  }
}

// Populate form with student data
function populateForm(student) {
  studentIdInput.value = student.student_id;
  editNameInput.value = student.name;
  editAddressInput.value = student.address;
  loadingMessageDiv.style.display = "none";
  editStudentForm.style.display = "block";
}

// Load data on page load
const studentIdToEdit = getStudentIdFromUrl();

if (studentIdToEdit) {
  fetchStudentData(studentIdToEdit).then((student) => {
    if (student) {
      populateForm(student);
    } else {
      loadingMessageDiv.textContent = "Student not found or failed to load.";
      messageDiv.textContent = "Could not find the student to edit.";
      messageDiv.style.color = "red";
    }
  });
} else {
  loadingMessageDiv.textContent = "No student ID specified for editing.";
  messageDiv.textContent =
    "Please provide a student ID in the URL (e.g., edit.html?id=1).";
  messageDiv.style.color = "orange";
}

// --- Form Submission for Update (PUT) ---
editStudentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const updatedStudentData = {
    name: editNameInput.value,
    address: editAddressInput.value,
  };

  const studentId = studentIdInput.value;

  const response = await fetch(`${apiBaseUrl}/students/${studentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedStudentData),
  });

  const responseBody = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? await response.json()
    : { message: response.statusText };

  if (response.status === 200) {
    messageDiv.textContent = "Student updated successfully!";
    messageDiv.style.color = "green";
    editStudentForm.reset();
    console.log("Updated Student:", responseBody);
  } else if (response.status === 400) {
    messageDiv.textContent = `Validation Error: ${responseBody.message}`;
    messageDiv.style.color = "red";
    console.error("Validation Error:", responseBody);
  } else if (response.status === 404) {
    messageDiv.textContent = `Error: Student not found.`;
    messageDiv.style.color = "red";
  } else {
    messageDiv.textContent = `Failed to update student: ${responseBody.message}`;
    messageDiv.style.color = "red";
  }

  // Optional: Redirect to index.html
  // window.location.href = "index.html";
});
