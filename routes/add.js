const mongoose = require("mongoose");

const add = mongoose.Schema({
     date: String,
     subject: String,
     textarea: String,
     email: String,
     mobile: String,
     userid: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "rem"
     }],
     sms: String,
     days: String
})
module.exports = mongoose.model("add", add)
