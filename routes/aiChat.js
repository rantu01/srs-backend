const express = require("express");
const axios = require("axios");

const router = express.Router();

module.exports = (db) => {
  router.post("/", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const botReply = response.data.choices[0].message.content;
      res.json({ reply: botReply });
    } catch (error) {
      console.error("AI Chat Error:", error.response?.data || error.message);
      res.status(500).json({ reply: "Failed to get response from AI" });
    }
  });

  return router;
};
