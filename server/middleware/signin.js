const jwt = require("jsonwebtoken");
const config = require("config");
const { User } = require("../models/user");

function signin(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "you must be logged in" });

  try {
    jwt.verify(token, config.get("jwtPrivateKey"), async (err, payload) => {
      if (err) {
        if (!token)
          return res.status(401).json({ error: "you must be logged in" });
      }

      const { _id } = payload;
      const userdata = await User.findById(_id);
      req.user = userdata;
      next();
    });
  } catch (ex) {
    res.status(404).json({ error: "Invalid token" });
  }
}

module.exports = signin;
