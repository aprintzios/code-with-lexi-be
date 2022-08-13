const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
  name:  String, 
  email: {type: String, unique: true, lowercase: true, trim: true, required: [true, 'Please enter an email address']},
  password: String,
  isAdmin: Boolean
  }, {
    timestamp: true,
});

module.exports = mongoose.model('User', userSchema)