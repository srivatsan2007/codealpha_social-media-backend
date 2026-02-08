// ---------------- IMPORTS ----------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const postRoutes = require("./src/routes/postRoutes");
const commentRoutes = require("./src/routes/commentRoutes");


// ---------------- CONFIG VARIABLES ----------------
const MONGO_URI = "mongodb+srv://Srivatsan:Iyyappan%402007@ecometrix.rgjqps6.mongodb.net/instasphere?retryWrites=true&w=majority";
const JWT_SECRET = "InstasphereSuperSecretKey123456";
const PORT = 5000;

// ---------------- INITIALIZE APP ----------------
const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());


// ---------------- ROUTES ----------------
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);


// ---------------- MONGODB CONNECTION ----------------
mongoose
  .connect(MONGO_URI) // Removed unsupported options
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

