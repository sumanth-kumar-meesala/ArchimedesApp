const TGA = require("../models/tga.model");
const Malacard = require("../models/malacards.model");
const mongoose = require("mongoose");

const findAllResult = keyword => {
  let models = [];
  models.push(mongoose.models.tga);
  models.push(mongoose.models.Malacard);

  return Promise.all(
    models.map(model =>
      model.find({
        $text: {
          $search: keyword
        }
      })
    )
  );
};

exports.search = function(req, res) {
  let keyword = req.body.keyword;

  findAllResult(keyword)
    .then(result => {
      var output = {
        success: true,
        message: "Successfully fetched data.",
        data: result
      };
      res.json(output);
    })
    .catch(err => {
      var output = {
        success: false,
        message: "Error occured while fetching the data."
      };
      res.json(output);
    });
};
