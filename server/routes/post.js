const _ = require("lodash");
const { Post, validate } = require("../models/post");
const signin = require("../middleware/signin");
const express = require("express");
const { result } = require("lodash");
const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name");
  res.json(posts);
});

router.post("/", signin, async (req, res) => {
  try {
    const { title, body, photo } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    req.user.password = undefined;
    const post = new Post({
      title,
      body,
      photo,
      postedBy: req.user,
    });

    const result = await post.save();
    res.json({ post: result });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/mypost", signin, async (req, res) => {
  const posts = await Post.find({ postedBy: req.user._id }).populate(
    "postedBy",
    "_id name"
  );

  res.json({ posts });
});

router.put("/like", signin, async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          likes: req.user._id,
        },
      },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.put("/unlike", signin, async (req, res) => {
  try {
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $pull: {
          likes: req.user._id,
        },
      },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.put("/comment", signin, async (req, res) => {
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
    };
    const result = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          comments: comment,
        },
      },
      { new: true }
    ).populate("comments.postedBy", "_id name");
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.delete("/deletepost/:postId", signin, async (req, res) => {
  try {
    const post = await Post.findByIdAndRemove({ _id: req.params.postId });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = router;
