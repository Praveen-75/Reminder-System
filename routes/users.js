const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb://localhost/login")


const userSchema = mongoose.Schema({
  name: String,
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
  },
  email: String,
  mobile: Number,
  password: String,
  setReminder: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "add"
  }]
})
mongoose.plugin(plm);
module.exports = mongoose.model("rem", userSchema);
