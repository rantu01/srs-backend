const express = require("express");
const { ObjectId } = require("mongodb");
const verifyFirebaseToken = require("../middleware/verifyToken");
const verifyTokenEmail = require("../middleware/verifyEmail");

const router = express.Router();

module.exports = (db) => {
  const reviewsCollection = db.collection("reviews");

  // Get reviews by serviceId
  router.get("/", async (req, res) => {
    const { serviceId } = req.query;
    if (!serviceId) return res.status(400).send({ error: "Missing serviceId" });

    const reviews = await reviewsCollection
      .find({ serviceId })
      .sort({ date: -1 })
      .toArray();
    res.send(reviews);
  });

  // Add a new review
  router.post("/",  async (req, res) => {
    const { serviceId, userName, userPhoto, text, rating, date, userEmail, serviceTitle } = req.body;
    if (!serviceId || !userName || !text || !rating || !date) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const review = {
      serviceId,
      serviceTitle,
      userEmail,
      userName,
      userPhoto,
      text,
      rating: parseInt(rating),
      date: new Date(date),
    };

    const result = await reviewsCollection.insertOne(review);
    res.send(result.ops ? result.ops[0] : review);
  });

  // Get reviews by user email
  router.get("/my-reviews",  async (req, res) => {
    const { userEmail } = req.query;
    const reviews = await reviewsCollection.find({ userEmail }).toArray();
    res.send(reviews);
  });

  // Update review
  router.put("/:id",  async (req, res) => {
    const { id } = req.params;
    const { text, rating } = req.body;

    const result = await reviewsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { text, rating } }
    );

    if (result.modifiedCount === 1) {
      res.send({ message: "Review updated successfully" });
    } else {
      res.status(404).send({ error: "Review not found or no change made" });
    }
  });

  // Delete review
  router.delete("/:id",  async (req, res) => {
    const { id } = req.params;
    const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.send({ message: "Review deleted successfully" });
    } else {
      res.status(404).send({ error: "Review not found" });
    }
  });

  return router;
};
