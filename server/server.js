import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// User API
app.use("/api/users", userRoutes);

// Recipe API
app.use("/api/recipes", recipeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MineMaster backend is running!" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
