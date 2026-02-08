const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// CREATE POST
router.post("/", async (req, res) => {
  const { userId, caption } = req.body;

  const post = new Post({
    userId,
    caption,
    image: "", // image upload later
    likes: []
  });

  await post.save();
  res.json(post);
});

// GET ALL POSTS
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// LIKE / UNLIKE POST
router.post("/:id/like", async (req, res) => {
  const { userId } = req.body;
  const post = await Post.findById(req.params.id);

  if (post.likes.includes(userId)) {
    post.likes.pull(userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  res.json({ likes: post.likes.length });
});

module.exports = router;
