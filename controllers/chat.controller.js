const Chat = require("../models/chat.model");
const User = require("../models/user.model");

exports.add_chat = function(req, res) {
  let chat_id = req.body.chat_id;
  let user_id = req.body.user_id;
  let message = req.body.message;
  let is_file = req.body.is_file;

  var messageObj = { user_id: user_id, message: message, is_file: is_file };

  Chat.findById(chat_id)
    .then(chat => {
      chat
        .add_message(messageObj)
        .then(value => {
          var output = {
            success: true,
            message: "Message sent successfully"
          };
          res.json(output);
        })
        .catch(error => {
          var output = {
            success: false,
            message: "Error occured while sending message."
          };
          res.json(output);
        });
    })
    .catch(error => {
      var output = {
        success: false,
        message: "Error occured while sending message."
      };
      res.json(output);
    });
};

exports.add_user = function(req, res) {
  let chat_user_id = req.body.user_id;
  let user_id = req.body.userId;

  Chat.find(
    {
      users: { $in: [user_id] }
    },
    function(err, data) {
      var exist = false;

      data.map(chat => {
        if (chat.users.includes(chat_user_id)) {
          exist = true;
        }
      });

      if (exist) {
        var output = {
          success: true,
          message: "User added successfully"
        };

        res.json(output);
      } else {
        let new_chat = new Chat({
          users: [chat_user_id, user_id]
        });

        new_chat.save(function(err, chat) {
          if (err) {
            var output = {
              success: false,
              message: "Error occured while adding users."
            };
            res.json(output);
          }

          User.findById(user_id)
            .then(user => {
              return user
                .add_chat(chat._id)
                .then(data => {
                  User.findById(chat_user_id)
                    .then(user => {
                      return user
                        .add_chat(chat._id)
                        .then(data => {
                          var output = {
                            success: true,
                            message: "User added successfully"
                          };

                          res.json(output);
                        })
                        .catch(err => {
                          var output = {
                            success: false,
                            message: "Error while adding user."
                          };

                          res.json(output);
                        });
                    })
                    .catch(err => {
                      var output = {
                        success: false,
                        message: "Error occured while fetching the data."
                      };
                      res.json(output);
                    });
                })
                .catch(err => {
                  var output = {
                    success: false,
                    message: "Error while adding user."
                  };

                  res.json(output);
                });
            })
            .catch(err => {
              var output = {
                success: false,
                message: "Error occured while fetching the data."
              };
              res.json(output);
            });
        });
      }
    }
  );
};

exports.get_chat = function(req, res) {
  let chat_id = req.body.chat_id;
  let count = req.body.count;

  Chat.findById(chat_id)
    .then(chat => {
      var output = {
        success: true,
        data: chat,
        message: "Chat fetched successfully."
      };
      res.json(output);
    })
    .catch(error => {
      var output = {
        success: false,
        message: "Error occured while fetching the data."
      };
      res.json(output);
    });
};
