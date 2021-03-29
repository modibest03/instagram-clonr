const config = require("config");
const mongoose = require("mongoose");
const signup = require("./routes/signup");
const signin = require("./routes/signin");
const post = require("./routes/post");
const protected = require("./routes/protected");
const user = require("./routes/user");
const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/instagram", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB...."))
  .catch((err) => console.error("could not connect to MongoDB....", err));

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

app.use(express.json());
app.use("/signup", signup);
app.use("/signin", signin);
app.use("/protected", protected);
app.use("/post", post);
app.use("/user", user);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
