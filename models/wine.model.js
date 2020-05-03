const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let WineSchema = new Schema({
  points: {
    type: Number
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  taster_name: {
    type: String
  },
  taster_twitter_handle: {
    type: String
  },
  price: {
    type: Number
  },
  designation: {
    type: String
  },
  variety: {
    type: String
  },
  region_1: {
    type: String
  },
  region_2: {
    type: String
  },
  province: {
    type: String
  },
  country: {
    type: String
  },
  winery: {
    type: String
  }
});

WineSchema.index({
  "$**": "text"
});

module.exports = mongoose.model("Wine", WineSchema, "wine");
