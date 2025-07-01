const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

const allowedOrigins = [
  "https://service-review-system.surge.sh",
  "http://localhost:5173", // example for local development
  "https://service-review-system-a0858.web.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "https://service-review-system.surge.sh",
//     credentials: true, // কুকি এক্সচেঞ্জ করার জন্য
//   })
// );
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@skillstack.6gwde6m.mongodb.net/?retryWrites=true&w=majority&appName=skillStack`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Example route
app.get("/", (req, res) => {
  res.send("Service Review System is running...");
});

//===========================================================================================

const admin = require("firebase-admin");

const decodedFB = Buffer.from(process.env.JWT_SECRET, "base64").toString(
  "utf8"
);
const serviceAccount = JSON.parse(decodedFB);

//const serviceAccount = require("./service-review-system-a0858-firebase-adminsdk-fbsvc-5949a9ed08.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// const verifyFirebaseToken = async (req, res, next) => {
//   // const authHeader = req.headers?.authorization;

//   // if (!authHeader || !authHeader.startsWith("Bearer ")) {
//   //   return res.status(401).send({ massage: "unauthorized access " });
//   // }

//   // const token = authHeader.split(" ")[1];

//   const token = req.cookies.Token; // NOT destructuring here
//   console.log(token);

//   try {
//     //const decoded = await admin.auth().verifyIdToken(token);
//     //const decoded = await admin.auth().verifySessionCookie(token, true);

//     const decoded = await admin.auth().verifySessionCookie(token, true);
//     console.log("Decoded token:", decoded);

//     req.decoded = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).send({ message: "unauthorized access" });
//   }
// };

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.cookies.Token; // NOT destructuring here

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    //const decoded = Buffer.from(process.env.JWT_SECRET, 'base64').toString('utf8');
    //const decoded = await admin.auth().verifySessionCookie(token, true);
    //console.log("Decoded token:", decoded);

    req.decoded = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).send({ message: "Unauthorized access" });
  }
};

const verifyTokenEmail = (req, res, next) => {
  if (req.query.userEmail !== req.decoded.email) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  next();
};

//===========================================================================================
async function run() {
  try {
    await client.connect();

    const db = client.db("serviceReviewDB");
    const servicesCollection = db.collection("services");
    const reviewsCollection = db.collection("reviews");
    const usersCollection = db.collection("users");

    ///jwt token
    app.post("/jwt", async (req, res) => {
      const { idToken } = req.body;
      //console.log("Received idToken:", idToken);

      try {
        // ✅ Set session cookie in response
        res.cookie("Token", idToken, {
          httpOnly: true,
          secure: true,
          sameSite: "None",
        });

        res.status(200).send({ message: "Login successful!" });
      } catch (error) {
        //console.error("Login error:", error);
        res.status(401).send("Unauthorized");
      }
    });

    // ✅ Add Service route
    app.post("/services", verifyFirebaseToken, async (req, res) => {
      const service = req.body;
      try {
        const result = await servicesCollection.insertOne(service);
        res.send({ insertedId: result.insertedId });
      } catch (error) {
        console.error("Insert error:", error);
        res.status(500).send({ error: "Failed to add service" });
      }
    });

    // Get all services
    app.get("/services", async (req, res) => {
  try {
    const { search = "", category = "", sort = "" } = req.query;

    const query = {};

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      query.$or = [
        { title: regex },
        { category: regex },
        { company: regex },
      ];
    }

    if (category) {
      query.category = category;
    }

    let sortOption = {}; // 🟢 Default: no sorting

    // Add sorting logic
    if (sort === "price_asc") {
      sortOption.price = 1;
    } else if (sort === "price_desc") {
      sortOption.price = -1;
    } else if (sort === "latest") {
      sortOption.createdAt = -1;
    } else if (sort === "oldest") {
      sortOption.createdAt = 1;
    }

    const allServices = await servicesCollection
      .find(query)
      .sort(sortOption) // 🟢 apply sorting
      .toArray();

    res.send(allServices);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).send({ error: "Failed to fetch services" });
  }
});


    // Get featured services (limit 6)
    app.get("/featured-services", async (req, res) => {
      try {
        const featured = await servicesCollection.find().limit(8).toArray();
        res.send(featured);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch featured services" });
      }
    });

    //details-service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const service = await servicesCollection.findOne({
          _id: new ObjectId(id),
        });
        if (!service)
          return res.status(404).send({ error: "Service not found" });
        res.send(service);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch service" });
      }
    });

    // === REVIEW ROUTES ===

    // Get reviews for a service
    app.get("/reviews", async (req, res) => {
      const { serviceId } = req.query;
      if (!serviceId)
        return res.status(400).send({ error: "Missing serviceId" });
      const reviews = await reviewsCollection
        .find({ serviceId })
        .sort({ date: -1 })
        .toArray();
      res.send(reviews);
    });

    // Add a new review
    app.post("/reviews", verifyFirebaseToken, async (req, res) => {
      const {
        serviceId,
        userName,
        userPhoto,
        text,
        rating,
        date,
        userEmail,
        serviceTitle,
      } = req.body;
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

    // Get services by user email
    app.get("/my-services", verifyFirebaseToken, async (req, res) => {
      const email = req.query.email;
      try {
        const services = await servicesCollection
          .find({ userEmail: email })
          .toArray();
        res.send(services);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch user services" });
      }
    });

    // Update a service by ID
    app.put("/services/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const updatedService = req.body;

      try {
        const result = await servicesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedService }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: "Service not found" });
        }

        res.send({ message: "Service updated successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to update service" });
      }
    });
    // Delete a service by ID
    app.delete("/services/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      try {
        const result = await servicesCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.send({ message: "Service deleted successfully" });
        } else {
          res.status(404).send({ error: "Service not found" });
        }
      } catch (error) {
        res.status(500).send({ error: "Failed to delete service" });
      }
    });

    // GET reviews by user email
    app.get(
      "/my-reviews",
      verifyFirebaseToken,
      verifyTokenEmail,
      async (req, res) => {
        const userEmail = req.query.userEmail; // get user email from query

        try {
          const reviews = await reviewsCollection.find({ userEmail }).toArray();
          res.send(reviews);
        } catch (error) {
          res.status(500).send({ error: "Failed to fetch reviews" });
        }
      }
    );

    // DELETE review by ID
    app.delete("/reviews/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      try {
        const result = await reviewsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res.send({ message: "Review deleted successfully" });
        } else {
          res.status(404).send({ error: "Review not found" });
        }
      } catch (error) {
        res.status(500).send({ error: "Failed to delete review" });
      }
    });

    // UPDATE review by ID
    app.put("/reviews/:id", verifyFirebaseToken, async (req, res) => {
      const id = req.params.id;
      const { text, rating } = req.body; // only updatable fields
      try {
        const result = await reviewsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { text, rating } }
        );
        if (result.modifiedCount === 1) {
          res.send({ message: "Review updated successfully" });
        } else {
          res.status(404).send({ error: "Review not found or no change made" });
        }
      } catch (error) {
        res.status(500).send({ error: "Failed to update review" });
      }
    });

    // Add this after all existing routes in your `run()` function

    // Count total users, services, and reviews
    app.get("/stats/counts", async (req, res) => {
      try {
        const totalServices = await servicesCollection.estimatedDocumentCount();
        const totalReviews = await reviewsCollection.estimatedDocumentCount();
        const totalUsers = await usersCollection.estimatedDocumentCount();

        // Mock user count (replace this with actual logic if users collection exists)
        // or get count from usersCollection if available

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

    //=================================================================================================================

    // In your backend (server.js or index.js)

    app.post("/users", verifyFirebaseToken, async (req, res) => {
      try {
        const { email, name, photoURL } = req.body;

        if (!email) {
          return res.status(400).send({ error: "Email is required" });
        }

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
          return res.status(200).send({ message: "User already exists" });
        }

        const user = {
          email,
          name: name || null,
          photoURL: photoURL || null,
          createdAt: new Date(),
        };

        const result = await usersCollection.insertOne(user);
        res.status(201).send({ insertedId: result.insertedId });
      } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send({ error: "Failed to add user" });
      }
    });

    ///=================================================================================================================

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
  // ❌ DON'T close the client here, it will break your API!
  // await client.close();
}

run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
