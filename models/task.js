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
  status: {
    type: String,
    enum: ["pending", "assigned", "done"],
  },
  deadline: {
    type: Date,
  },
});

var Task = mongoose.model("Task", taskSchema);

module.exports = Task;
