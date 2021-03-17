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
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");

dotenv.config();
app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL_LOCAL,
    }),
  })
);

app.get("/", (req, res) => {
  res.render("home");
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

app.get("/worker/profile/edit", (req, res) => {
  res.render("./worker/edit_profile", { user: req.session.user });
});

app.put("/worker/profile/edit", async (req, res) => {
  const user = await db.User.findByIdAndUpdate(req.session.user._id, req.body, {
    returnOriginal: false,
  });
  req.session.user = user;
  res.redirect("/dashboard/worker");
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

app.get(
  "/dashboard/manager",
  middleware.isLoggedInManager,
  async (req, res) => {
    const tasks = await db.Task.find({ manager_id: req.session.user._id });
    res.render("./manager/dashboard", { tasks: tasks });
  }
);

app.get("/task/add", (req, res) => {
  res.render("./manager/add_task");
});

app.post("/task/add", async (req, res) => {
  req.body.manager_id = req.session.user._id;
  await db.Task.create(req.body);
  res.redirect("/dashboard/manager");
});

app.get("/task/:task_id/edit", async (req, res) => {
  const task = await db.Task.findById(req.params.task_id);
  res.render("./manager/edit_task", { task: task });
});

app.put("/task/:task_id/edit", async (req, res) => {
  const task = await db.Task.findByIdAndUpdate(req.params.task_id, req.body);
  res.redirect("/dashboard/manager");
});

app.get("/task/:task_id/assign", async (req, res) => {
  const workers = await db.User.find({ access: "worker" });
  res.render("./manager/assign_task", {
    workers: workers,
    task_id: req.params.task_id,
  });
});

app.post("/task/:task_id/assign", async (req, res) => {
  await db.Task.findByIdAndUpdate(req.params.task_id, req.body);
  res.redirect("/dashboard/manager");
});

app.get("/dashboard/worker", middleware.isLoggedInWorker, async (req, res) => {
  const tasks = await db.Task.find({ worker_id: req.session.user._id });
  res.render("./worker/dashboard", { tasks: tasks });
});

app.get("/task/:task_id/submit", async (req, res) => {
  const task = await db.Task.findById(req.params.task_id);
  res.render("./worker/submit_task", { task: task });
});

app.post("/task/:task_id/submit", async (req, res) => {
  await db.Task.findByIdAndUpdate(req.params.task_id, { solution: req.body });
  res.redirect("/dashboard/worker");
});

app.get("/task/:task_id/submission", async (req, res) => {
  const task = await db.Task.findById(req.params.task_id);
  res.render("./manager/submitted_task", { task: task });
});

app.post("/task/:task_id/submission", async (req, res) => {
  req.body.submitted_on = new Date().toISOString().split("T")[0];
  const task = await db.Task.findByIdAndUpdate(req.params.task_id, req.body);
  res.redirect("/dashboard/manager");
});

app.get("/tasks", async (req, res) => {
  let tasks = null;
  let status = req.query.status;
  let page = Math.max(parseInt(req.query.page), 1);
  let date = req.query.date?new Date(new Date(req.query.date).getTime()-86400000).toISOString():req.query.date;
  if (status === "pending") {
    if (date) {
      tasks = await db.Task.find({ status: status, created_on: date })
        .skip((page - 1) * 5)
        .limit(5);
    } else {
      tasks = await db.Task.find({ status: status })
        .skip((page - 1) * 5)
        .limit(5);
    }
  } else if (status === "assigned" || status === "submitted") {
    if (date) {
      tasks = await db.Task.find({
        $or: [{ status: "assigned" }, { status: "submitted" }],
        created_on: date,
      })
        .skip((page - 1) * 5)
        .limit(5);
    } else {
      tasks = await db.Task.find({
        $or: [{ status: "assigned" }, { status: "submitted" }],
      })
        .skip((page - 1) * 5)
        .limit(5);
    }
  } else {
    if (date) {
      tasks = await db.Task.find({
        $or: [{ status: "approved" }, { status: "rejected" }],
        created_on: date,
      })
        .skip((page - 1) * 5)
        .limit(5);
    } else {
      tasks = await db.Task.find({
        $or: [{ status: "approved" }, { status: "rejected" }],
      })
        .skip((page - 1) * 5)
        .limit(5);
    }
  }

  res.json({ tasks: tasks });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});
