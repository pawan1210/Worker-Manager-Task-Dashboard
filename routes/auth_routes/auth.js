const express = require("express");
const router = express.Router();
const db = require("../../models");
const bcrypt = require("bcrypt");
const constants = require("./constants");
const middleware=require("../helpers/middleware");


router.get("/",middleware.isLoggedIn.common, (req, res) => {
  res.render("home");
});

router.get("/register", middleware.isLoggedIn.common, (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, constants.saltRounds);
    req.body.password = password;
    await db.User.create(req.body);
    res.redirect("/login");
  } catch {
    res.status(400).json({
        success:"false",
        message:"email or phone already exists"
    })
  }
});

router.get("/login", middleware.isLoggedIn.common, (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const user = await db.User.findOne({ email: req.body.email });
  if (user) {
    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
      req.session.user=user;
      res.redirect(`/${user.access}/dashboard`);
    } else {
      res.status(400).json({
          success:false,
          message:"Password doesn't match"
      })
    }
  } else {
    res.status(400).json({
      success: false,
      message: "User doesn't exists",
    });
  }
});

router.get("/logout",(req,res)=>{
    delete req.session.user;
    res.redirect("/login");
})


module.exports=router;