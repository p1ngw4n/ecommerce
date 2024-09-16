const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide name"],
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: [true, "please provide password"],
    trim: true,
    minlength: 6,
  },
  email: {
    type: String,
    unique: true,
    required: [true, "please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "please provide valid email",
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  // console.log(this.isModfied('name'));

  if (!this.isModified("password")) {
    return;
  }
  console.log('troll');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidate) {
  console.log("yooo");
  console.log(candidate);
  console.log(this.password);
  const isMatch = await bcrypt.compare(candidate, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
