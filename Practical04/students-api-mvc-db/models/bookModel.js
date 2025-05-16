const sql = require("mssql");
const dbConfig = require("../dbConfig");

// Get all students
async function getAllStudents() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, name, address FROM Students";
    const result = await connection.request().query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Get student by ID
async function getStudentById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "SELECT id, name, address FROM Students WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);

    if (result.recordset.length === 0) {
      return null; // Student not found
    }

    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Create new student
async function createStudent(studentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "INSERT INTO Students (name, address) VALUES (@name, @address); SELECT SCOPE_IDENTITY() AS id;";
    const request = connection.request();
    request.input("name", studentData.name);
    request.input("address", studentData.address);
    const result = await request.query(query);

    const newStudentId = result.recordset[0].id;
    return await getStudentById(newStudentId);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Update student by ID
async function updateStudent(id, studentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "UPDATE Students SET name = @name, address = @address WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    request.input("name", studentData.name);
    request.input("address", studentData.address);
    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return null; // Student not found
    }

    return await getStudentById(id);
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

// Delete student by ID
async function deleteStudent(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "DELETE FROM Students WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return null; // Student not found
    }

    return { message: "Student deleted successfully" };
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
