const express = require("express");
const router = express.Router();
const db = require("../../models");
const utils=require("./utils");
const multer=require("multer");
const upload = multer({ storage: utils.storage });
const middleware = require("../helpers/middleware");

router.get("",middleware.isLoggedIn.manager, (req, res) => {
  res.render("./task/add_task");
});

router.post("", middleware.isLoggedIn.manager, async (req, res) => {
  req.body.manager_id = req.session.user._id;
  await db.Task.create(req.body);
  res.redirect("/manager/dashboard");
});

router.get("/:task_id", middleware.isLoggedIn.manager, async (req, res) => {
  const task = await db.Task.findById(req.params.task_id);
  res.render("./task/edit_task", { task: task });
});

router.put("/:task_id", middleware.isLoggedIn.manager, async (req, res) => {
  const task = await db.Task.findByIdAndUpdate(req.params.task_id, req.body);
  res.redirect("/manager/dashboard");
});

router.get(
  "/:task_id/assign",
  middleware.isLoggedIn.manager,
  async (req, res) => {
    const workers = await db.User.find({ access: "worker" });
    res.render("./task/assign_task", {
      workers: workers,
      task_id: req.params.task_id,
    });
  }
);

router.post(
  "/:task_id/assign",
  middleware.isLoggedIn.manager,
  async (req, res) => {
    const task = await db.Task.findByIdAndUpdate(req.params.task_id, req.body);
    res.redirect("/manager/dashboard");
  }
);


router.get("/:task_id/submit",middleware.isLoggedIn.worker, async (req, res) => {
  const task = await db.Task.findById(req.params.task_id);
  res.render("./task/submit_task", { task: task });
});

router.post("/:task_id/submit",[middleware.isLoggedIn.worker,upload.single("file")], async (req, res) => {
  let body=utils.save_files(req,req.params.task_id);
  body.submitted_on=new Date().toISOString().split("T")[0];
  await db.Task.findByIdAndUpdate(req.params.task_id,body);
  res.redirect("/worker/dashboard");
});

router.get("/:task_id/review",middleware.isLoggedIn.manager, async (req, res) => {
  const task = await db.Task.findById(req.params.task_id);
  const file = await db.File.findOne({ task_id: req.params.task_id });
  res.render("./task/review_task", { task: task,file:file });
});

router.post(
  "/:task_id/review",
  middleware.isLoggedIn.manager,
  async (req, res) => {
    req.body.submitted_on = new Date().toISOString().split("T")[0];
    const task = await db.Task.findByIdAndUpdate(req.params.task_id, req.body);
    res.redirect("/manager/dashboard");
  }
);

router.get(
  "/:task_id/view",
  middleware.isLoggedIn.worker,
  async (req, res) => {
    const task = await db.Task.findById(req.params.task_id);
    const file = await db.File.findOne({ task_id: req.params.task_id });
    res.render("./task/view_task", { task: task, file: file });
  }
);


router.get("/:id/all", async (req, res) => {
  const tasks = await utils.get_tasks(req);
  res.json({ tasks:tasks });
});

module.exports=router;