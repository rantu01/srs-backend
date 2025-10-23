const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");
    return client.db("serviceReviewDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

module.exports = { client, connectDB };
