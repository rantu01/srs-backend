const express = require("express");
const { ObjectId } = require("mongodb");
const verifyFirebaseToken = require("../middleware/verifyToken");

const router = express.Router();

module.exports = (db) => {
  const servicesCollection = db.collection("services");

  router.post("/",  async (req, res) => {
    const service = req.body;
    const result = await servicesCollection.insertOne(service);
    res.send({ insertedId: result.insertedId });
  });

  router.get("/", async (req, res) => {
    const allServices = await servicesCollection.find().toArray();
    res.send(allServices);
  });

  router.get("/:id", async (req, res) => {
    const service = await servicesCollection.findOne({ _id: new ObjectId(req.params.id) });
    res.send(service);
  });

  router.put("/:id",  async (req, res) => {
    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.send({ modifiedCount: result.modifiedCount });
  });

  router.delete("/:id",  async (req, res) => {
    const result = await servicesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send({ deletedCount: result.deletedCount });
  });

  return router;
};
