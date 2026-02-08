const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// ADD COMMENT
router.post("/", async (req, res) => {
  const { postId, userId, text } = req.body;

  const comment = new Comment({ postId, userId, text });
  await comment.save();

  res.json(comment);
});

// GET COMMENTS FOR POST
router.get("/:postId", async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId });
  res.json(comments);
});

module.exports = router;
