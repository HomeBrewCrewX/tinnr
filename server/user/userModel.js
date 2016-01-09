var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Q = require('q');
var SALT = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  salt: String,
  savedRecipes: [],
  calendarRecipes: [], //for calendar 
  dietPreferences: {
    type: Object,
    default: {}
  }
});

UserSchema.methods.checkPassword = function(password) {
  var defer = Q.defer();
  var savedPW = this.password;
  bcrypt.compare(password, savedPW, function(err, isMatch) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(isMatch);
    }
  });
  return defer.promise;
};

UserSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(error, hash) {
      if (error) {
        return next(error);
      }

      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

module.exports = mongoose.model('users', UserSchema);
