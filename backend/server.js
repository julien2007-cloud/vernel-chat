require("dotenv").config();
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const pool = require("./database");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./auth");
app.use(cors());
app.use(express.json());

app.post("/addUser", async (req, res) => {
  const first_name = req.body["firstname"];
  const last_name = req.body["lastname"];
  const email = req.body["email"];
  const password = req.body["password"];

  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    const insertSTMT = `INSERT INTO accounts (user__first_name, user__last_name, user_email, user_password)
         VALUES ($1, $2, $3, $4) `;
    const response = await pool.query(insertSTMT, [
      first_name,
      last_name,
      email,
      hashedpassword,
    ]);
    console.log("Data Saved");
    console.log(response);
    const sql_to_find_userId = `SELECT user_id FROM accounts WHERE user_email = $1`;
    const result_user_id = await pool.query(sql_to_find_userId, [email]);
    const user_id = result_user_id.rows[0].user_id;
    const token = jwt.sign(
      { userId: user_id, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "SignUp successful",
      token: token,
    });
  } catch (error) {
    console.log(error);
  }
});

// LOGIN A NEW USER
app.post("/loginUser", async (req, res) => {
  const email = req.body["email"];
  const password = req.body["password"];

  //   const hash_login_password = bcrypt.hash(password, 10);
  try {
    const sql_Query_toFind_password = `SELECT user_password FROM accounts WHERE user_email = $1`;
    const result = await pool.query(sql_Query_toFind_password, [email]);
    console.log(result);
    if (result.rowCount == 0) {
      console.log("No user with this email and password");
    } else {
      const stored_hashed_password = result.rows[0].user_password;
      const isCorrect = await bcrypt.compare(password, stored_hashed_password);

      console.log(isCorrect);

      if (isCorrect == true) {
        console.log("User found");
        const sql_to_find_userId = `SELECT user_id FROM accounts WHERE user_email = $1`;
        const result_user_id = await pool.query(sql_to_find_userId, [email]);
        const user_id = result_user_id.rows[0].user_id;
        console.log(user_id);

        const token = jwt.sign(
          { userId: user_id, email: email },
          process.env.JWT_SECRET,
          { expiresIn: "1000d" }
        );
        res.status(200).json({
          message: "Login successful",
          token: token,
        });
        console.log("Token Created!!!");
      } else {
        console.log("No password matches your password");
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//Find A chat patner/this is for the find friend page
app.get("/findallUsers", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  console.log(userId);
  const query_to_find_other_users = `SELECT user_id, user__first_name, user__last_name FROM accounts
   WHERE user_id != $1
   AND user_id NOT IN (
   SELECT newfriend_id FROM connectionDB WHERE user_id = $1
   UNION
   SELECT user_id FROM connectionDB WHERE user_id = $1
   )
   ORDER BY user__first_name`;
  try {
    const result = await pool.query(query_to_find_other_users, [userId]);
    console.log(result);
    res.status(200).json({ success: true, users: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
});
// this is to add you and your user to the connection db
app.post("/createConnection", authenticateToken, async (req, res) => {
  const newfriend_id = req.body.userId;
  const myId = req.user.userId;

  const sql_to_insert_connection = `INSERT INTO connectionDB (user_id, newfriend_id) VALUES ($1, $2)`;
  try {
    const result = await pool.query(sql_to_insert_connection, [
      myId,
      newfriend_id,
    ]);
    console.log("Connecction has been created");
    console.log(result);
  } catch (error) {
    console.log(error);
  }
});

// this is for when your inside the chatRoom then you call this to get all your messages
app.get("/getAllmessages/:friendId", authenticateToken, async (req, res) => {
  const user_id = req.user.userId;
  const connection_id = req.params.friendId;
  const sql_to_get_messages = `SELECT message, timestamp, sender_id FROM messages WHERE
   (sender_id = $1 AND recipient_id = $2) OR
   (sender_id = $2 AND recipient_id = $1)
   ORDER BY timestamp ASC `;
  const sql_Query_to_find_usersNames = `SELECT user_id, user__first_name, user__last_name FROM accounts
  WHERE user_id = $1`;
  try {
    const result = await pool.query(sql_to_get_messages, [
      user_id,
      connection_id,
    ]);
    const name_result = await pool.query(sql_Query_to_find_usersNames, [
      connection_id,
    ]);
    console.log(name_result);
    console.log(result);
    res
      .status(200)
      .json({
        success: true,
        messages: result.rows,
        connection_name: name_result.rows,
      });
  } catch (error) {
    console.log(error);
  }
});
// this partucular function is to add a message to the db
app.post("/postMessage", authenticateToken, async (req, res) => {
  const senderId = req.user.userId;
  const receiverId = req.body.recipientId;
  const message = req.body.message;
  const sql_to_post_messages = `INSERT INTO messages (sender_id, recipient_id, message) VALUES ($1, $2, $3) `;
  try {
    const result = await pool.query(sql_to_post_messages, [
      senderId,
      receiverId,
      message,
    ]);
    console.log(result);
    res.status(200).json({ success: true, messages: result.rows });
  } catch (error) {
    console.log(error);
  }
});

// even if someone has added me from somewhere and not sent me a message yet will show oon chatHome

app.get("/getAllconnectedfriends", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const sql_to_get_all_your_friends_and_chat = `SELECT a.user_id, a.user__first_name, a.user__last_name, f.created_at
FROM accounts a
JOIN connectiondb f
  ON (f.user_id = $1 AND f.newfriend_id = a.user_id)
  OR (f.newfriend_id = $1 AND f.user_id = a.user_id)
ORDER BY f.created_at DESC`;
  try {
    const result = await pool.query(sql_to_get_all_your_friends_and_chat, [
      userId,
    ]);

    res.status(200).send({ success: true, message: result.rows });
    console.log(result.rows);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
