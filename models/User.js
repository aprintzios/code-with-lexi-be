const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName:  String, // String is shorthand for {type: String}
  lastName: String,
  emailAddress: String,
  password: String
  }, {
    timestamp: true,
});

module.exports = mongoose.model('User', userSchema)