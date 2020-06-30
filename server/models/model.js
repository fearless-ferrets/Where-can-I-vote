const { Pool } = require('pg');

const DB_URI = process.env.POSTGRES_URI;
// console.log(DB_URI);

const dbconnect = new Pool({
  connectionString: DB_URI,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query : ', text);
    return dbconnect.query(text, params, callback);
  },
};
