const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  user_id: { type: String },
  message: { type: String },
  is_file: {
    type: Boolean,
    default: false
  },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("message", MessageSchema, "message");
