const express = require("express");

const router = express.Router();

module.exports = (db) => {
  const usersCollection = db.collection("users");
  const servicesCollection = db.collection("services");
  const reviewsCollection = db.collection("reviews");

  router.get("/counts", async (req, res) => {
    try {
      const totalUsers = await usersCollection.estimatedDocumentCount();
      const totalServices = await servicesCollection.estimatedDocumentCount();
      const totalReviews = await reviewsCollection.estimatedDocumentCount();

      res.send({
        users: totalUsers,
        services: totalServices,
        reviews: totalReviews,
      });
    } catch (error) {
      console.error("Error getting counts:", error);
      res.status(500).send({ error: "Failed to fetch counts" });
    }
  });

  return router;
};
