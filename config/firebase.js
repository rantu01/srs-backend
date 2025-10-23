const admin = require("firebase-admin");

const decodedFB = Buffer.from(process.env.JWT_SECRET, "base64").toString("utf8");
const serviceAccount = JSON.parse(decodedFB);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
