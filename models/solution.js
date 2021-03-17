var mongoose = require("mongoose");

var solutionSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  worker_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "approved", "rejected"],
  },
  points_obtained:{
      type:Number
  },
  files: {
    type: [String],
  },
});

var Solution = mongoose.model("Solution", solutionSchema);

module.exports = Solution;
