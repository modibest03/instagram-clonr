const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
const { string } = require("joi");
const { ObjectId } = mongoose.Schema.Types;

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 150,
  },
  body: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 5000,
  },
  photo: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5000,
  },
  likes: [{ type: ObjectId, ref: "User" }],
  comments: [
    {
      text: String,
      postedBy: { type: ObjectId, ref: "User" },
    },
  ],
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
});

const Post = mongoose.model("Post", PostSchema);

function validatePost(post) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(150).required(),
    body: Joi.string().min(3).max(5000).required(),
    photo: Joi.string().min(5).max(500).required(),
  });

  return schema.validate(post);
}

exports.Post = Post;
exports.validate = validatePost;
