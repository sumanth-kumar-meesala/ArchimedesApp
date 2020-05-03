const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const TGA = require("../models/tga.model");
const Malacards = require("../models/malacards.model");
const jwt = require("jsonwebtoken");
const config = require("../config");
const nodemailer = require("nodemailer");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});
var rand, mailOptions, host, link;

exports.search = function(req, res) {
  let search = req.body.keyword;
  let count = req.body.count;
  let user_id = req.body.userId;

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

  User.find(value)
    .select("name company_name email")
    .skip(count)
    .limit(20)
    .then(users => {
      var output = {
        success: true,
        message: "Successfully fetched users.",
        data: users
      };
      res.json(output);
    })
    .catch(error => {
      var output = {
        success: false,
        message: "Error occured while fetching the users."
      };
      res.json(output);
    });
};

exports.list_users = function(req, res) {
  let user_id = req.body.userId;

  User.findById(user_id).then(user => {
    Chat.find({ _id: { $in: user.chats } })
      .then(data => {
        var userIds = [];
        data.map(chat => {
          chat.users.map(userId => {
            if (!userIds.includes(userId)) {
              userIds.push(userId);
            }
          });
        });

        userIds.splice(userIds.indexOf(user_id), 1);

        User.find({ _id: { $in: userIds } })
          .select("name company_name email chats chat_id")
          .then(users => {
            users.map(list_user => {
              list_user.chats.map(chat_id => {
                if (user.chats.includes(chat_id)) {
                  list_user.chat_id = chat_id;
                }
              });

              list_user.chats = undefined;
            });

            var output = {
              success: true,
              data: users,
              chat_ids: user.chats,
              message: "User fetched successfully."
            };
            res.json(output);
          })
          .catch(error => {
            var output = {
              success: true,
              data: user,
              message: "User fetched successfully."
            };

            res.json(output);
          });
      })
      .catch(error => {
        var output = {
          success: false,
          message: "Error while fetching user details."
        };

        res.json(output);
      })
      .catch(error => {
        var output = {
          success: true,
          data: user,
          message: "User fetched successfully."
        };

        res.json(output);
      });
  });
};

exports.search = function(req, res) {
  let search = req.body.keyword;
  let count = req.body.count;
  let user_id = req.body.userId;

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

  User.find(value)
    .select("name company_name email")
    .skip(count)
    .limit(20)
    .then(users => {
      var output = {
        success: true,
        message: "Successfully fetched users.",
        data: users
      };
      res.json(output);
    })
    .catch(error => {
      var output = {
        success: false,
        message: "Error occured while fetching the users."
      };
      res.json(output);
    });
};

exports.profile = function(req, res) {
  let user_id = req.body.userId;

  User.findById(user_id)
    .select(
      "email tga_bookmarks malacards_bookmarks name address company_name my_tga"
    )
    .then(user => {
      var tga_ids = user.tga_bookmarks;

      var malacards_ids = user.malacards_bookmarks;

      var my_tga_ids = user.my_tga;

      if (my_tga_ids.length > 0) {
        TGA.find({ _id: { $in: my_tga_ids } })
          .then(my_tgas => {
            my_tgas.map(tga => {
              tga.is_bookmarked = false;
            });

            getBookmarks(res, user, tga_ids, malacards_ids, my_tgas);
          })
          .catch(error => {
            var output = {
              success: true,
              data: user,
              message: "User fetched successfully."
            };

            res.json(output);
          });
      } else {
        getBookmarks(res, user, tga_ids, malacards_ids, []);
      }
    })
    .catch(err => {
      var output = {
        success: false,
        message: "Unable to fetch user details."
      };

      res.json(output);
    });
};

function getBookmarks(res, user, tga_ids, malacards_ids, my_tgas) {
  if (tga_ids.length > 0 && malacards_ids.length > 0) {
    Malacards.find({ _id: { $in: malacards_ids } })
      .then(malacards => {
        TGA.find({ _id: { $in: tga_ids } })
          .then(tgas => {
            malacards.map(malacard => {
              malacard.is_bookmarked = true;
            });

            tgas.map(tga => {
              tga.is_bookmarked = true;
            });

            var output = {
              success: true,
              data: user,
              tgas: tgas,
              malacards: malacards,
              my_tgas: my_tgas,
              message: "User fetched successfully."
            };
            res.json(output);
          })
          .catch(error => {
            var output = {
              success: true,
              data: user,
              message: "User fetched successfully."
            };

            res.json(output);
          });
      })
      .catch(error => {
        var output = {
          success: true,
          data: user,
          message: "User fetched successfully."
        };

        res.json(output);
      });
  } else if (malacards_ids.length > 0) {
    Malacards.find({ _id: { $in: malacards_ids } })
      .then(malacards => {
        malacards.map(tga => {
          malacards.is_bookmarked = true;
        });

        var output = {
          success: true,
          data: user,
          malacards: malacards,
          my_tgas: my_tgas,
          message: "User fetched successfully."
        };
        res.json(output);
      })
      .catch(error => {
        var output = {
          success: true,
          data: user,
          message: "User fetched successfully."
        };

        res.json(output);
      });
  } else {
    TGA.find({ _id: { $in: tga_ids } })
      .then(tgas => {
        tgas.map(tga => {
          tga.is_bookmarked = true;
        });

        var output = {
          success: true,
          data: user,
          tgas: tgas,
          my_tgas,
          message: "User fetched successfully."
        };
        res.json(output);
      })
      .catch(error => {
        var output = {
          success: true,
          data: user,
          message: "User fetched successfully."
        };

        res.json(output);
      });
  }
}

exports.malacards_add_bookmark = function(req, res) {
  let id = req.body.malacards_id;
  let user_id = req.body.userId;

  User.findById(user_id)
    .then(user => {
      return user
        .add_malacards_bookmark(id)
        .then(data => {
          var output = {
            success: true,
            message: "Bookmark successfull."
          };

          res.json(output);
        })
        .catch(err => {
          var output = {
            success: false,
            message: "Error while bookmarking."
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
};

exports.malacards_remove_bookmark = function(req, res) {
  let id = req.body.malacards_id;
  let user_id = req.body.userId;

  User.findById(user_id)
    .then(user => {
      return user
        .remove_malacards_bookmark(id)
        .then(data => {
          var output = {
            success: true,
            message: "Bookmark remove successfull."
          };

          res.json(output);
        })
        .catch(err => {
          var output = {
            success: false,
            message: "Error while removing bookmark."
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
};

exports.tga_add_bookmark = function(req, res) {
  let id = req.body.tga_id;
  let user_id = req.body.userId;

  User.findById(user_id)
    .then(user => {
      return user
        .add_tga_bookmark(id)
        .then(data => {
          var output = {
            success: true,
            message: "Bookmark successfull."
          };

          res.json(output);
        })
        .catch(err => {
          var output = {
            success: false,
            message: "Error while bookmarking."
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
};

exports.tga_remove_bookmark = function(req, res) {
  let id = req.body.tga_id;
  let user_id = req.body.userId;

  User.findById(user_id)
    .then(user => {
      return user
        .remove_tga_bookmark(id)
        .then(data => {
          var output = {
            success: true,
            message: "Bookmark remove successfull."
          };

          res.json(output);
        })
        .catch(err => {
          var output = {
            success: false,
            message: "Error while removing bookmark."
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
};

exports.payment = function(req, res) {
  const body = {
    source: req.body.paymentToken.id,
    amount: req.body.amount,
    currency: "usd"
  };

  stripe.charges.create(body, function(stripeErr, stripeRes) {
    if (stripeErr) {
      res.json({
        success: false,
        message: "checkout failed."
      });
    } else {
      let user_id = req.body.userId;

      User.findById(user_id)
        .then(user => {
          user
            .go_premium()
            .then(success => {
              res.json({
                success: true,
                message: "Payment success"
              });
            })
            .catch(error => {
              res.json({
                success: false,
                message: "Error while adding details"
              });
            });
        })
        .catch(error => {
          res.json({
            success: false,
            message: "Unable to find user."
          });
        });
    }
  });
};

exports.register = function(req, res) {
  User.findOne(
    {
      email: req.body.email
    },
    function(err, user) {
      if (err) {
        throw err;
      }

      rand_id = Math.floor(Math.random() * 100 + 54);

      const new_user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        address: req.body.address,
        company_name: req.body.company_name,
        email_verification_id: rand_id
      });

      if (user) {
        res.json({
          success: false,
          message: "User already exists."
        });
      } else {
        new_user.save(function(err) {
          if (err) {
            throw err;
          }

          sendEmail(new_user, req);

          res.json({
            success: true,
            message: "User registration successful."
          });
        });
      }
    }
  );
};

exports.login = function(req, res) {
  User.findOne(
    {
      email: req.body.email
    },
    function(err, user) {
      if (err) {
        throw err;
      }

      if (user) {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (err) {
            throw err;
          }

          if (isMatch) {
            if (user.is_verified) {
              const payload = {
                userid: user._id
              };

              var token = jwt.sign(payload, process.env.secret, {
                expiresIn: 60 * 60 * 24
              });

              res.json({
                success: true,
                message: "Access token generation successfull.",
                token: token,
                name: user.name,
                userId: user._id,
                isPremium: user.isPremium,
                is_first_time: user.is_first_time
              });
            } else {
              res.json({
                success: false,
                message: "User not verified.",
                token: token
              });
            }
          } else {
            res.json({
              success: false,
              message: "Authentication failed. Wrong password."
            });
          }
        });
      } else {
        res.json({
          success: false,
          message: "Authentication failed. User not found."
        });
      }
    }
  );
};

exports.update_profile = function(req, res) {
  let want_commercialise = req.body.want_commercialise;
  let looking_for = req.body.looking_for;
  let tags = req.body.tags;
  let user_id = req.body.userId;

  User.findById(user_id)
    .then(user => {
      return user
        .update_profile(want_commercialise, looking_for, tags)
        .then(data => {
          var output = {
            success: true,
            message: "Profile updated successfully."
          };

          res.json(output);
        })
        .catch(err => {
          var output = {
            success: false,
            message: "Error while updating profile."
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
};

exports.logout = function(req, res) {
  res.status(200).send({
    auth: false,
    token: null
  });
};

exports.verify = function(req, res) {
  User.findOne(
    {
      email: req.query.email
    },
    function(err, user) {
      if (err) {
        throw err;
      }

      if (user) {
        if (user.is_verified) {
          res.json({
            success: false,
            message: "Email already verified."
          });
        } else {
          if (user.email_verification_id == req.query.id) {
            user.is_verified = true;

            user.save(function(err) {
              if (err) {
                throw err;
              }

              res.json({
                success: true,
                message: "User verification successful."
              });
            });
          } else {
            res.json({
              success: false,
              message: "Invalid verification ID."
            });
          }
        }
      } else {
        res.json({
          success: false,
          message: "User doesn't exist."
        });
      }
    }
  );
};

exports.resend = function(req, res) {
  User.findOne(
    {
      email: req.query.email
    },
    function(err, user) {
      if (err) {
        throw err;
      }

      if (user) {
        if (user.is_verified) {
          res.json({
            success: false,
            message: "Email already verified."
          });
        } else {
          rand_id = Math.floor(Math.random() * 100 + 54);
          user.email_verification_id = rand_id;

          user.save(function(err) {
            if (err) {
              throw err;
            }

            sendEmail(user, req);

            res.json({
              success: true,
              message: "Email verification sent successfully."
            });
          });
        }
      } else {
        res.json({
          success: false,
          message: "User doesn't exist."
        });
      }
    }
  );
};

function sendEmail(user, req) {
  host = req.get("host");
  rand = user.email_verification_id;
  email = user.email;
  username = user.name;

  link = "http://" + req.get("host") + "/verify?id=" + rand + "&email=" + email;

  mailOptions = {
    to: email,
    subject: "Please confirm your Email account",
    html: "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> <html xmlns='http://www.w3.org/1999/xhtml'> <head> <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /> <title>Archimedes Account Verification</title> <meta name='viewport' content='width=device-width, initial-scale=1.0' /> <style> button { display: inline-block; border: none; padding: 1rem 2rem; margin: 0; text-decoration: none; background: #13aa52; color: #ffffff; font-family: sans-serif; font-size: 1rem; cursor: pointer; border-radius: 6px; text-align: center; transition: background 250ms ease-in-out, transform 150ms ease; -webkit-appearance: none; -moz-appearance: none; } button:hover, button:focus { background: #0B9038; } button:focus { outline: 1px solid #fff; outline-offset: -4px; } button:active { transform: scale(0.99); } </style> </head> <body style='background: #ecf0f1'> <table align='center' border='0' cellpadding='20' cellspacing='20' width='600' style='border-collapse: collapse;background: #fff;border-radius: 6px'> <tr> <td style='color: #153643; font-family: Arial, sans-serif; font-size: 16px; padding-top: 24px;padding-bottom: 24px'> <b>Archimedes</b> </td> </tr> <tr> <td style='color: #153643; font-family: Arial, sans-serif; font-size: 30px; line-height: 20px;padding-bottom: 24px'> <b>Verify your email</b> </td> </tr> <tr> <td style='color: #9e9e9e; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;padding-bottom: 24px'> Hi {{username}}, Use this below link to activate your account and start using Archimedes. </td> </tr> <tr> <td align='center' style='color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;padding-bottom: 24px'> <button><a href='{{link}}' style='color:white;text-decoration: none'>Verify email</a></button> </td> </tr> <td bgcolor='#13aa52' style='padding: 30px 30px 30px 30px;border-bottom-left-radius: 6px;border-bottom-right-radius: 6px'> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td width='75%' style='color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;'> Copyright © 2018, Archimedes. All Rights Reserved </td> <td align='right'> <table border='0' cellpadding='0' cellspacing='0'> <tr> <td> <a href='http://www.twitter.com/'> <img src='https://www.iconsdb.com/icons/preview/white/twitter-xxl.png' alt='Twitter' width='38' height='38' style='display: block;' border='0' /> </a> </td> <td style='font-size: 0; line-height: 0;' width='20'>&nbsp;</td> <td> <a href='http://www.facebook.com/'> <img src='https://www.iconsdb.com/icons/preview/white/facebook-3-xxl.png' alt='Facebook' width='38' height='38' style='display: block;' border='0' /> </a> </td> </tr> </table> </td> </tr> </table> </td> </table> </body> </html>"
      .replace("{{username}}", username)
      .replace("{{link}}", link)
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log("Error sending email.");
      console.log(error);
    }
  });
}
