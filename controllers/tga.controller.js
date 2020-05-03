const TGA = require("../models/tga.model");
const PBS = require("../models/pbs.model");
const User = require("../models/user.model");

exports.search = function(req, res) {
  let search = req.body.keyword;
  let count = req.body.count;
  let userId = req.body.userId;

  User.findById(userId, function(userError, user) {
    if (userError) {
      var output = {
        success: false,
        message: "Error occured while fetching the TGA."
      };
      res.json(output);
    } else {
      let value;
      if (search == "") {
        value = {};
      } else {
        value = {
          $text: {
            $search: search
          }
        };
      }

      TGA.find(value, function(err, data) {
        if (err) {
          var output = {
            success: false,
            message: "Error occured while fetching the TAG."
          };
          res.json(output);
        } else {
          data.forEach(tga => {
            if (user.tga_bookmarks.includes(tga._id)) {
              tga.is_bookmarked = true;
            } else {
              tga.is_bookmarked = false;
            }
          });

          var output = {
            success: true,
            message: "Successfully fetched TGA.",
            data: data
          };
          res.json(output);
        }
      })
        .skip(count)
        .limit(20);
    }
  });
};

exports.filters = function(req, res) {
  TGA.aggregate(
    [
      {
        $group: {
          _id: null,
          entry_fors: { $addToSet: "$entry_for" },
          sponser_names: { $addToSet: "$sponser_name" },
          active_ingredients: { $addToSet: "$active_ingredients" }
        }
      }
    ],
    function(err, result) {
      if (err) {
        return res.json(err);
      } else {
        res.json(result);
      }
    }
  );
};

exports.add_tga = function(req, res) {
  let tgaRaw = req.body.tgas;
  let userId = req.body.userId;
  var tgas = [];

  tgaRaw.map(tga => {
    var value = {
      product_name: tga.product_name,
      active_ingredients: tga.active_ingredients,
      sponser_name: tga.sponser_name,
      entry_for: tga.entry_for,
      phase: tga.phase,
      details: {
        title: "Description",
        value: tga.details
      }
    };

    tgas.push(value);
  });

  User.findById(userId)
    .then(user => {
      TGA.insertMany(tgas)
        .then(value => {
          user
            .add_my_tga(value)
            .then(success => {
              var output = {
                success: true,
                message: "Drugs added successfully"
              };
              res.json(output);
            })
            .catch(error => {
              var output = {
                success: false,
                message: "Error occured while fetching the TGA."
              };
              res.json(output);
            });
        })
        .catch(error => {
          var output = {
            success: false,
            message: "Error occured while fetching the TGA."
          };
          res.json(output);
        });
    })
    .catch(error => {
      var output = {
        success: false,
        message: "Error occured while fetching the TGA."
      };
      res.json(output);
    });
};

exports.details = function(req, res) {
  let id = req.body.id;

  TGA.findById(id).exec(function(err, data) {
    if (err) {
      var output = {
        success: false,
        message: "Error occured while fetching the TGA."
      };
      res.json(output);
    } else {
      if (data != null && data.active_ingredients != "N/A") {
        PBS.find(
          {
            $text: {
              $search: data.active_ingredients
            }
          },
          function(err, pbsData) {
            if (err) {
              var output = {
                success: false,
                message: "Error occured while fetching the TGA."
              };
              res.json(output);
            } else {
              var output = {
                success: true,
                message: "Successfully fetched TGA.",
                data: data,
                pbsData: pbsData
              };
              res.json(output);
            }
          }
        );
      } else {
        var output = {
          success: true,
          message: "Successfully fetched TGA.",
          data: data
        };
        res.json(output);
      }
    }
  });
};
