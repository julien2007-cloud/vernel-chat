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
// // )`;
// pool
//   .query(createTblQry)
//   .then((response) => {
//     console.log("Table created");
//     console.log(response);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// const checkForTable = `SELECT connectiondb FROM TABLES`;

// const checkTable = () => {
//   // const results = pool.query(checkForTable);
//   pool
//     .query(checkForTable)
//     .then((response) => {
//       console.log(response);
//       if (results.rows == null) {
//         const createConnectionDB = `CREATE TABLE connectiondb(
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES accounts(user_id) UNIQUE NOT NULL,
//         newfriend_id INTEGER REFERENCES accounts(user_id) UNIQUE NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
//         pool
//           .query(createConnectionDB)
//           .then((response) => {
//             console.log("Table created");
//             console.log(response);
//           })
//           .catch((err) => {
//             console.log(err);
//           });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
// pool.query();
module.exports = pool;
