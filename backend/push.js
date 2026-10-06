const pool = require("./database");
const { getMessaging } = require("./firebase");

async function notifyUser(userId, { title, body, data = {} }) {
  const { rows } = await pool.query(
    "SELECT token FROM device_tokens WHERE user_id = $1",
    [userId]
  );
  const tokens = rows.map((r) => r.token);
  if (!tokens.length) return;

  const response = await getMessaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    // FCM requires every data value to be a string
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ),
    android: {
      priority: "high",
      notification: { channelId: "messages" }, // matches the channel created in fcm.ts
    },
  });

  // Remove tokens Firebase says are dead (app uninstalled, token rotated)
  const dead = [];
  response.responses.forEach((r, i) => {
    const code = r.error?.code;
    if (
      !r.success &&
      (code === "messaging/registration-token-not-registered" ||
        code === "messaging/invalid-registration-token")
    ) {
      dead.push(tokens[i]);
    }
  });
  if (dead.length) {
    await pool.query("DELETE FROM device_tokens WHERE token = ANY($1)", [dead]);
  }
}

module.exports = { notifyUser };
