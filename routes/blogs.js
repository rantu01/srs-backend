// routes/blogs.js
const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

module.exports = function (db) {
  const blogsCollection = db.collection("blogs");

  // Create a new blog
  router.post("/", async (req, res) => {
    try {
      const blog = req.body;
      blog.createdAt = new Date();
      const result = await blogsCollection.insertOne(blog);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to create blog" });
    }
  });

  // Get all blogs
  router.get("/", async (req, res) => {
    try {
      const blogs = await blogsCollection.find().sort({ createdAt: -1 }).toArray();
      res.send(blogs);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch blogs" });
    }
  });

  // Get single blog by ID
  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
      if (!blog) return res.status(404).send({ error: "Blog not found" });
      res.send(blog);
    } catch (error) {
      res.status(500).send({ error: "Failed to fetch blog" });
    }
  });

  // Delete blog
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: "Failed to delete blog" });
    }
  });

  return router;
};
