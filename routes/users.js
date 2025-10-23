const express = require("express");
const verifyFirebaseToken = require("../middleware/verifyToken");

const router = express.Router();

module.exports = (db) => {
  const usersCollection = db.collection("users");

  // Add a user
  router.post("/",  async (req, res) => {
    const { email, name, photoURL } = req.body;
    if (!email) return res.status(400).send({ error: "Email is required" });

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) return res.status(200).send({ message: "User already exists" });

    const user = { email, name: name || null, photoURL: photoURL || null, createdAt: new Date() };
    const result = await usersCollection.insertOne(user);
    res.status(201).send({ insertedId: result.insertedId });
  });

  // Get all users
  router.get("/", async (req, res) => {
    const users = await usersCollection.find().toArray();
    res.send(users);
  });

  return router;
};
