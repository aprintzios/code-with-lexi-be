const mongoose = require("mongoose")
const { Schema } = mongoose;

const sessionSchema = new Schema({
  date:  Date, 
  time: String,
  user: {type: mongoose.Types.ObjectId, ref: "User", default: null}
  }, {
    timestamp: true,
});

module.exports = mongoose.model('Session', sessionSchema)