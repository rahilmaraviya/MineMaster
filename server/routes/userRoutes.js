import express from "express";
import User from "../models/User.js";

const router = express.Router();

console.log("User routes loaded");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register new user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update user
router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
