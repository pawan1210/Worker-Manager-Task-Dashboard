const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const models = require("./models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("./models");
const session = require("express-session");
const middleware = require("./middleware");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.redirect("/login");
});

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
      if (!req.session.user) {
        req.session.user = user;
      }
      res.redirect(`/dashboard/${user.access}`);
    } else {
      res.send("/login");
    }
  } else {
    res.send("User not found");
  }
});

app.get("/logout", (req, res) => {
  delete req.session.user;
  res.redirect("/login");
});

app.get("/dashboard/manager", middleware.isLoggedIn, async (req, res) => {
  const tasks = await db.Task.find({ manager_id: req.session.user._id });
  res.render("./manager/dashboard", { tasks: tasks });
});

app.get("/task/add", (req, res) => {
  res.render("./manager/add_task");
});

app.post("/task/add", async (req, res) => {
  req.body.manager_id = req.session.user._id;
  await db.Task.create(req.body);
  res.send("Task Added Successfully");
});

app.get("/task/:task_id/edit", async (req, res) => {
  const task = await db.Task.findById(req.params.task_id);
  res.render("./manager/edit_task", { task: task });
});

app.put("/task/:task_id/edit", async (req, res) => {
  const task = await db.Task.findByIdAndUpdate(req.params.task_id, req.body);
  res.redirect("/dashboard/manager");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});
