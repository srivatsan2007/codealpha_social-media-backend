const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const User = require("../models/User");

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// GET USER PROFILE
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "profilename password profilePhoto followers following"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("FETCH USER ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE USER ACCOUNT
router.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// FOLLOW / UNFOLLOW USER
router.post("/follow/:id", async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const { userId } = req.body;

    if (userId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(userId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (targetUser.followers.includes(userId)) {
      // UNFOLLOW
      targetUser.followers.pull(userId);
      currentUser.following.pull(targetUserId);
    } else {
      // FOLLOW
      targetUser.followers.push(userId);
      currentUser.following.push(targetUserId);
    }

    await targetUser.save();
    await currentUser.save();

    res.json({
      followers: targetUser.followers.length,
      following: currentUser.following.length
    });
  } catch (err) {
    console.error("FOLLOW ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

