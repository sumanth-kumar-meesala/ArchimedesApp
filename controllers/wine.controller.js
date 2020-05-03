const Wine = require("../models/wine.model");

exports.getTopTen = function(req, res) {
  Wine.find({}, "variety points")
    .sort("-points")
    .limit(10)
    .then(data => {
      var output = {
        success: true,
        topTen: data
      };

      res.json(output);
    })
    .catch(error => {
      var output = {
        success: false,
        error: error
      };

      res.json(output);
    });
};
