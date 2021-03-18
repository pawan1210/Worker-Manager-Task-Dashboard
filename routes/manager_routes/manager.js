const express = require("express");
const router = express.Router();
const db = require("../../models");
const middleware = require("../helpers/middleware");

router.get(
  "/dashboard",
  middleware.isLoggedIn.manager,
  async (req, res) => {
    res.render("./manager/dashboard", { manager_id:req.session.user._id });
  }
);

module.exports=router
