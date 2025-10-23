// const express = require("express");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const router = express.Router();

// module.exports = (db) => {
//   router.post("/", async (req, res) => {
//     const { message } = req.body;
//     if (!message) return res.status(400).json({ error: "Message is required" });

//     try {
//       const client = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

//       // Gemini chat call
//       const result = await client.responses.create({
//         model: "gemini-1.5",
//         input: [
//           {
//             role: "user",
//             content: [{ type: "text", text: message }],
//           },
//         ],
//       });

//       const reply = result.output_text || "No reply from AI";

//       res.json({ reply });
//     } catch (err) {
//       console.error("Gemini AI Chat Error:", err);
//       res.status(500).json({ error: err.message || "Internal Server Error" });
//     }
//   });

//   return router;
// };
