const _ = require("lodash");
const { User } = require("../models/user");
const { Post } = require("../models/post");
const signin = require("../middleware/signin");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.get("/:id", signin, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    if (!user) return res.status(400).send("User does not exist");

    const post = await Post.findOne({ postedBy: req.params.id }).populate(
      "postedBy",
      "_id name"
    );
    res.json({ user, post });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

module.exports = router;
