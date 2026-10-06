// const { initializeApp, cert, getApps } = require("firebase-admin/app");
// const { getMessaging } = require("firebase-admin/messaging");
// const admin = require("firebase-admin");
// const serviceAccount = require("./firebase-service-account.json");

// if (!admin.apps.length) {
//   admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
// }

// module.exports = admin;
const fs = require("fs");
const path = require("path");
const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");

// On Render the key is uploaded as a Secret File and mounted at /etc/secrets.
// Locally it sits next to this file (gitignored).
const KEY_FILE = "firebase-service-account.json";
const keyPath = [path.join("/etc/secrets", KEY_FILE), path.join(__dirname, KEY_FILE)]
  .find((p) => fs.existsSync(p));

// Without the key, keep the chat server running and just skip push
let pushEnabled = false;
if (keyPath) {
  const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
  }
  pushEnabled = true;
} else {
  const secrets = fs.existsSync("/etc/secrets") ? fs.readdirSync("/etc/secrets") : [];
  console.warn(
    `Push notifications disabled: ${KEY_FILE} not found in /etc/secrets or ${__dirname}. ` +
      `Files in /etc/secrets: [${secrets.join(", ")}]`
  );
}

module.exports = { getMessaging, pushEnabled };