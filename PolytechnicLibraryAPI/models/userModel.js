const sql      = require('mssql');
const dbConfig = require('../dbConfig');

async function getUserByUsername(username) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      SELECT user_id, username, passwordHash, role 
      FROM Users 
      WHERE username = @username
    `;
    const request = connection.request();
    request.input('username', username);

    const result = await request.query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Database error in getUserByUsername:', error);
    throw error;
  } finally {
    if (connection) {
      try { await connection.close(); }
      catch (e) { console.error('Error closing connection', e); }
    }
  }
}

async function createUser({ username, passwordHash, role }) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = `
      INSERT INTO Users (username, passwordHash, role)
      VALUES (@username, @passwordHash, @role);
      SELECT user_id, username, role 
      FROM Users 
      WHERE user_id = SCOPE_IDENTITY();
    `;
    const request = connection.request();
    request.input('username', username);
    request.input('passwordHash', passwordHash);
    request.input('role', role);

    const result = await request.query(query);
    return result.recordset[0];
  } catch (error) {
    console.error('Database error in createUser:', error);
    throw error;
  } finally {
    if (connection) {
      try { await connection.close(); }
      catch (e) { console.error('Error closing connection', e); }
    }
  }
}

module.exports = { getUserByUsername, createUser };
