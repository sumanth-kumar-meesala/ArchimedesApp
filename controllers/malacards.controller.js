const Malacards = require("../models/malacards.model");
const User = require("../models/user.model");
const PBS = require("../models/pbs.model");

exports.search = function(req, res) {
  let search = req.body.keyword;
  let count = req.body.count;
  let userId = req.body.userId;

  User.findById(userId, function(userError, user) {
    if (userError) {
      var output = {
        success: false,
        message: "Error occured while fetching the Malacards."
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

      Malacards.find(value, function(err, data) {
        if (err) {
          var output = {
            success: false,
            message: "Error occured while fetching the Malacards."
          };
          res.json(output);
        } else {
          data.forEach(malacard => {
            if (user.malacards_bookmarks.includes(malacard._id)) {
              malacard.is_bookmarked = true;
            } else {
              malacard.is_bookmarked = false;
            }
          });

          var output = {
            success: true,
            message: "Successfully fetched Malacards.",
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
  Malacards.aggregate(
    [
      {
        $group: {
          _id: null,
          category: { $addToSet: "$category" },
          family: { $addToSet: "$family" },
          mifts: { $addToSet: "$mifts" }
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

exports.details = function(req, res) {
  let id = req.body.id;

  Malacards.findById(id).exec(function(err, data) {
    if (err) {
      var output = {
        success: false,
        message: "Error occured while fetching the Malacards."
      };
      res.json(output);
    } else {
      if (data != null && data.drugs != null) {
        var keywords = [];

        data.drugs.forEach(element => {
          keywords.push(element.name);
        });

        PBS.find(
          {
            $text: {
              $search: keywords
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
                message: "Successfully fetched Malacards.",
                data: data,
                pbsData: pbsData
              };

              res.json(output);
            }
          }
        )
          .skip(0)
          .limit(20);
      } else {
        var output = {
          success: true,
          message: "Successfully fetched Malacards.",
          data: data
        };
        res.json(output);
      }
    }
  });
};
