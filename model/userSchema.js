const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
  },
  message : {
    type : String,
    required : true,
  },
  Phone : {
    type : Number,
    required : true,
  }
})

module.exports = mongoose.model("User" , userSchema)

