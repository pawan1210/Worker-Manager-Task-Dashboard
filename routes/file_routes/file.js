const express = require("express");
const router = express.Router();
const path=require("path");

router.get("/:file_name/view", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.file_name);
  res.download(filePath);
});

module.exports=router;