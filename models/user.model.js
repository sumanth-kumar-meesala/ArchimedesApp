const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const Tga = require("../models/tga.model");
const Malacards = require("../models/malacards.model");
const SALT_WORK_FACTOR = 10;

let UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_first_time: {
    type: Boolean,
    default: true
  },
  email_verification_id: {
    type: String,
    required: false
  },
  is_mail_sent: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  },
  chat_id: {
    type: String
  },
  looking_for: {
    type: Boolean,
    default: false
  },
  want_commercialise: {
    type: Boolean,
    default: false
  },
  tga_bookmarks: [{ type: String, ref: "tga" }],
  malacards_bookmarks: [{ type: String, ref: "malacards" }],
  chats: [{ type: String }],
  tags: [{ type: String }],
  my_tga: [{ type: String, ref: "tga" }],
  premium_date: { type: Date },
  isPremium: {
    type: Boolean,
    default: false
  }
});

UserSchema.index({
  "$**": "text"
});

UserSchema.methods.add_chat = function(id) {
  if (this.chats.indexOf(id) === -1) {
    this.chats.push(id);
  }
  return this.save();
};

UserSchema.methods.remove_chat = function(id) {
  this.chats.remove(id);
  return this.save();
};

UserSchema.methods.update_profile = function(
  want_commercialise,
  looking_for,
  tags
) {
  this.want_commercialise = want_commercialise;
  this.looking_for = looking_for;
  this.tags = tags;
  this.is_first_time = false;
  return this.save();
};

UserSchema.methods.go_premium = function() {
  this.isPremium = true;
  this.premium_date = Date.now();
  return this.save();
};

UserSchema.methods.add_malacards_bookmark = function(id) {
  if (this.malacards_bookmarks.indexOf(id) === -1) {
    this.malacards_bookmarks.push(id);
  }
  return this.save();
};

UserSchema.methods.add_my_tga = function(values) {
  values.map(value => {
    if (this.my_tga.indexOf(value.id) === -1) {
      this.my_tga.push(value.id);
    }
  });

  return this.save();
};

UserSchema.methods.remove_malacards_bookmark = function(id) {
  this.malacards_bookmarks.remove(id);
  return this.save();
};

UserSchema.methods.add_tga_bookmark = function(id) {
  if (this.tga_bookmarks.indexOf(id) === -1) {
    this.tga_bookmarks.push(id);
  }
  return this.save();
};

UserSchema.methods.remove_tga_bookmark = function(id) {
  this.tga_bookmarks.remove(id);
  return this.save();
};

UserSchema.pre("save", function(next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("user", UserSchema, "users");
