const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
mongoose.set("useFindAndModify", false);
mongoose.set("debug", true);
mongoose.set("useCreateIndex", true);

mongoose.connect(process.env.MONGO_URL_LOCAL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.Promise = Promise;
module.exports.User = require("./user");
module.exports.Task = require("./task");
module.exports.Solution = require("./solution");
