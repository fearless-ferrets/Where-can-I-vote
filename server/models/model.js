const { Pool } = require('pg');

const DB_URI = process.env.POSTGRES_URI;

const dbconnect = new Pool({
  connectionString: DB_URI,
});

module.exports = dbconnect;
