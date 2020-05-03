const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Message = require("../models/message.model");

let ChatSchema = new Schema({
  users: {
    type: Array,
    required: true
  },
  message: [{ type: Object, ref: "Message" }],
  created_at: { type: Date, default: Date.now }
});

ChatSchema.methods.add_message = function(message) {
  this.message.push(message);
  return this.save();
};

module.exports = mongoose.model("chat", ChatSchema, "chats");
