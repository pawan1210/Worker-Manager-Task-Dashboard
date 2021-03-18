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
const multer = require("multer");
const utils = require("./utils");
const upload = multer({ storage: utils.storage });
const path=require("path");

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

app.post("/task/:task_id/submit",upload.single("file"), async (req, res) => {
  let body=saveFiles(req,req.params.task_id);
  await db.Task.findByIdAndUpdate(req.params.task_id,body);
  res.redirect("/dashboard/worker");
});

app.get("/task/:task_id/mark", async (req, res) => {
  const task = await db.Task.findById(req.params.task_id);
 const file = await db.File.findOne({ task_id: req.params.task_id });
  res.render("./manager/submitted_task", { task: task,file:file });
});

app.post("/task/:task_id/mark", async (req, res) => {
  req.body.submitted_on = new Date().toISOString().split("T")[0];
  const task = await db.Task.findByIdAndUpdate(req.params.task_id, req.body);
  res.redirect("/dashboard/manager");
});

app.get("/task/:task_id/view",async(req,res)=>{
  const task=await db.Task.findById(req.params.task_id);
  const file = await db.File.findOne({task_id:req.params.task_id});
  res.render("./worker/submitted_task",{task:task,file:file});
})

app.get("/file/:file_name/view",(req,res)=>{
  const filePath = path.join(
    __dirname,
    "uploads",
    req.params.file_name
  );
  res.download(filePath);
});

app.get("/tasks", async (req, res) => {
  console.log(req.query);
  const status = req.query.status;
  const page = Math.max(parseInt(req.query.page), 1);
  const date = req.query.date
    ? new Date(new Date(req.query.date).getTime() - 86400000).toISOString()
    : req.query.date;
  const queryBody = formatQueryBody(req);
  const limit = 5;
  const tasks = await db.Task.find(queryBody)
    .skip((page - 1) * limit)
    .limit(limit);
  res.json({ tasks: tasks });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started");
});

function formatQueryBody(req) {
  let body = { status: req.query.status };
  if (req.created_on) {
    body.created_on = req.query.created_on;
  }
  if (req.submitted_on) {
    body.submitted_on = req.submitted_on;
  }
  return body;
}

function saveFiles(req,task_id){
  let body = {};
  body.status = "submitted";
  if(req.file){
    req.body.file = req.file.filename;
    db.File.create({
      original_file_name: req.file.originalname,
      file_name: req.file.filename,
      task_id: task_id,
    });
  }
  body.solution = req.body;
  return body;
}
