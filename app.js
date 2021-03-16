const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const models = require("./models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("./models");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = password;
    await db.User.create(req.body);
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const user = await db.User.findOne({ email: req.body.email });
  if (user) {
    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
      res.send("Login Successful");
    } else {
      res.send("Login Unsuccessful");
    }
  } else {
    res.send("User not found");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});
