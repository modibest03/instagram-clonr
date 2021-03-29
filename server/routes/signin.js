const _ = require("lodash");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let savedUser = await User.findOne({ email: req.body.email });
    if (!savedUser)
      return res.status(400).json({ error: "Invalid Email or password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      savedUser.password
    );
    if (!validPassword)
      return res.status(400).json({ error: "Invalid Email or password" });

    const token = savedUser.generateAuthToken();
    const { _id, name, email } = savedUser;
    res.json({ token, user: { _id, name, email } });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
}

module.exports = router;
