const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: '',
  database: 'hanine_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
    throw err;
  }
  console.log('Connected to database');
});

module.exports = db;
