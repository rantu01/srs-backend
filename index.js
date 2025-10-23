require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/db");

// Routes
const servicesRoute = require("./routes/services");
const reviewsRoute = require("./routes/reviews");
const usersRoute = require("./routes/users");
const statsRoute = require("./routes/stats");
// AI Chat route
const aiChatRoute = require("./routes/aiChat");

const app = express();

const allowedOrigins = [
  "https://service-review-system.surge.sh",
  "http://localhost:5173",
  "https://service-review-system-a0858.web.app",
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

(async () => {
  const db = await connectDB();

  app.use("/services", servicesRoute(db));
  app.use("/reviews", reviewsRoute(db));
  app.use("/users", usersRoute(db));
  app.use("/stats", statsRoute(db));

  // Add AI Chat route
  app.use("/aiChat", aiChatRoute(db));

  app.get("/", (req, res) => res.send("Service Review System running"));

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
