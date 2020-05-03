const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MalacardSchema = new Schema({
  _id: { type: String, required: true },
  mcid: { type: String, required: true },
  name: { type: String, required: true },
  mifts: { type: String, required: true },
  family: { type: String, required: true },
  category: { type: String, required: true },
  details: { type: [], required: true },
  drugs: {
    type: ["Mixed"]
  },
  fdas: {
    type: ["Mixed"]
  },
  is_bookmarked: { type: Boolean, required: false, default: false }
});

MalacardSchema.index({ "$**": "text" });

// Export the model
module.exports = mongoose.model("Malacard", MalacardSchema, "malacards");
