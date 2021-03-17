var mongoose = require("mongoose");

var taskSchema = new mongoose.Schema({
  manager_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  worker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  maximum_points: {
    type: Number,
  },
  score:{
    type:Number
  },
  status: {
    type: String,
    default:"pending",
    enum: ["pending", "assigned","submitted","rejected","approved"],
  },
  deadline: {
    type: Date,
  },
  solution:{
    text:{
      type:String,
    },
    files:{
      type:[String]
    }
  },
  created_on:{
    type:Date
  },
  submitted_on:{
    type:Date
  }
});

var Task = mongoose.model("Task", taskSchema);

module.exports = Task;
