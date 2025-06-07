// dbConfig.js

/**
 * Database configuration module for connecting to a SQL Server database.
 * This configuration is typically used with the `mssql` Node.js package.
 *
 * All sensitive credentials and settings are sourced from environment variables
 * to keep them secure and easily configurable.
 *
 * The configuration object is exported via `module.exports` to be imported
 * into other parts of the backend application, such as the database connection logic.
 */

module.exports = {
  // Username for authenticating to the SQL Server
  user: process.env.DB_USER,

  // Password for the above user
  password: process.env.DB_PASSWORD,

  // The server address where the SQL Server is hosted
  server: process.env.DB_SERVER,

  // The name of the specific database to connect to
  database: process.env.DB_DATABASE,

  // Necessary for local development or when using self-signed certificates
  trustServerCertificate: true,

  // Additional connection options
  options: {
    // Port number where SQL Server is listening
    port: parseInt(process.env.DB_PORT),

    // Maximum time (in milliseconds) to wait while connecting to the database
    connectionTimeout: 60000, // 60 seconds
  },
};
