var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  access: {
    type: String,
    enum: ["manager", "worker"],
  },
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

var User = mongoose.model("User", userSchema);

module.exports = User;
