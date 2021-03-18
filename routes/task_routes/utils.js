const db = require("../../models");
const constants = require("./constants");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


function formatQueryBody(req) {
  return new Promise(async (resolve,reject)=>{
      let body = { status: req.query.status }; 
      let user =await db.User.findById(req.params.id);
      if(user.access==="worker"){
        body.worker_id=req.params.id;
      }else{
        body.manager_id=req.params.id;
      }
      if (req.query.created_on) {
        body.created_on = getFormattedDate(req.query.created_on);
        console.log(body.created_on);
      }
      if (req.query.submitted_on) {
        body.submitted_on = getFormattedDate(req.query.submitted_on);
        console.log(body.submitted_on);
      }
      resolve(body);
  })
  
}

function save_files(req, task_id) {
  let body = {};
  body.status = "submitted";
  if (req.file) {
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

async function get_tasks(req){
  return new Promise(async (resolve,reject)=>{
    const status = req.query.status;
    const page = Math.max(parseInt(req.query.page), 1);
    const queryBody = await formatQueryBody(req);
    const limit = 5;
    const tasks = await db.Task.find(queryBody)
      .skip((page - 1) * limit)
      .limit(constants.limit);
    resolve(tasks);
  })
}

function getFormattedDate(date){
  return new Date(
    new Date(date).getTime()
  ).toISOString();
}

module.exports = {
 get_tasks:get_tasks,
 save_files:save_files,
 storage:storage
};
