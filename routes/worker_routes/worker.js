const express = require("express");
const router = express.Router();
const db = require("../../models");
const middleware=require("../helpers/middleware");

router.get("/dashboard", middleware.isLoggedIn.worker, async (req, res) => {
  res.render("./worker/dashboard", { worker_id: req.session.user._id });
});

router.get("/dashboard/profile", middleware.isLoggedIn.worker, (req, res) => {
  res.render("./worker/edit_profile", { user: req.session.user });
});

router.put("/dashboard/profile", middleware.isLoggedIn.worker, async (req, res) => {
  const user = await db.User.findByIdAndUpdate(req.session.user._id, req.body, {
    returnOriginal: false,
  });
  req.session.user = user;
  res.redirect("/worker/dashboard");
});

module.exports=router;