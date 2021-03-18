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
  score: {
    type: Number,
  },
  status: {
    type: String,
    default: "unassigned",
    enum: ["unassigned", "pending", "submitted", "approved", "rejected"],
  },
  deadline: {
    type: Date,
  },
  solution: {
    text: {
      type: String,
    },
    file: {
      type: String,
    },
  },
  created_on: {
    type: Date,
    default: new Date().toISOString().split("T")[0],
  },
  submitted_on: {
    type: Date,
  },
});

var Task = mongoose.model("Task", taskSchema);

module.exports = Task;
