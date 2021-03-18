var mongoose = require("mongoose");

var fileSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  original_file_name: {
    type: String,
  },
  file_name: {
    type: String,
  },
});

var File = mongoose.model("File", fileSchema);

module.exports = File;
