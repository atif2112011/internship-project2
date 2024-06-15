const mysql = require("mysql2/promise");

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost", // e.g., 'localhost'
  user: "root", // e.g., 'root'
  password: "root", // e.g., 'password'
  database: "testDB", // e.g., 'mydatabase'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
