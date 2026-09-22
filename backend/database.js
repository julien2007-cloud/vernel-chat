const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: process.env.DB_URL,
});

// const createTblQry = `CREATE TABLE accounts(
//     user_id SERIAL PRIMARY KEY,
//     user__first_name VARCHAR(255) UNIQUE NOT NULL,
//     user__last_name VARCHAR(255) UNIQUE NOT NULL,
//     user_email VARCHAR(255) UNIQUE NOT NULL,
//     user_password VARCHAR(255) UNIQUE NOT NULL
// )`;

// pool
//   .query(createTblQry)
//   .then((response) => {
//     console.log("Table created");
//     console.log(response);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = pool;
