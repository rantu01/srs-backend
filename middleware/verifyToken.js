const admin = require("../config/firebase");

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.cookies.Token;

  if (!token) return res.status(401).send({ message: "Unauthorized" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = verifyFirebaseToken;
