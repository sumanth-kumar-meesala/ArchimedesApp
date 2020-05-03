const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let TGASchema = new Schema({
  product_name: {
    type: String,
    required: true
  },
  active_ingredients: {
    type: String,
    required: true
  },
  sponser_name: {
    type: String,
    required: true
  },
  entry_for: {
    type: String,
    required: true
  },
  phase: {
    type: String
  },
  details: {
    type: [],
    required: true
  },
  is_bookmarked: { type: Boolean, required: false, default: false }
});
TGASchema.index({
  "$**": "text"
});

module.exports = mongoose.model("tga", TGASchema, "tga");
