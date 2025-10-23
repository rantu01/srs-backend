const express = require("express");

const router = express.Router();

module.exports = (db) => {
  router.post("/", async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    console.log("Received message:", message);

    try {
      // Node.js fetch ব্যবহার (Node 18+)
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        }),
      });

      const data = await response.json();

      // Debugging
      console.log("OpenAI response:", data);

      if (!response.ok) {
        console.error("OpenAI API Error:", data);
        return res.status(response.status).json({
          error: data.error?.message || "OpenAI API Error",
        });
      }

      const botReply = data.choices[0].message.content;
      res.json({ reply: botReply });
    } catch (error) {
      console.error("AI Chat Exception:", error.message);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  return router;
};
