var User = require('./userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');

module.exports = {
  signin: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    var findUser = Q.nbind(User.findOne, User);
    findUser({username: username})
      .then(function(user) {
        if (!user) {
          res.status(401).send({error: 'User does not exist'});
          next(new Error('User does not exist'));
        } else {
          return user.checkPassword(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'secret');
                res.json({
                  username: user.username,
                  token: token,
                  preferences: user.dietPreferences
                });
              } else {
                res.status(401).send('User or password is incorrect');
                next(new Error('User or password is incorrect'));
              }
            });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },
  signup: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var dietPreferences = req.body.preferences;

    var findOne = Q.nbind(User.findOne, User);

    // check to see if user already exists
    findOne({username: username})
      .then(function(user) {
        if (user) {
          res.status(403).send({error: 'User already exist!'});
          next(new Error('User already exist!'));
        } else {
          var newUser = {
            username: username,
            password: password,
            dietPreferences: dietPreferences
          };
          var newSignupUser = new User(newUser);
          return newSignupUser.save();
        }
      })
      .then(function(user) {
        // create token to send back for auth
        var token = jwt.encode(user, 'secret');
        res.json({token: token});
      })
      .fail(function(error) {
        next(error);
      });
  },
  checkAuth: function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('no token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function(foundUser) {
          if (foundUser) {
            res.status(200).send();
          } else {
            res.status(401).send();
          }
        })
        .fail(function(error) {
          next(error);
        });
    }
  },
  getSavedMeals: function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('no token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function(foundUser) {
          if (foundUser) {
            var recipes = [];
            for(var i = 0; i < foundUser.savedRecipes.length; i++){
              //push recipe prop from each object in foundUser.savedRecipes
              recipes.push(foundUser.savedRecipes[i].recipe);
            }
            res.status(200);
            res.json(recipes);
          } else {
            res.status(401).send();
          }
        })
        .fail(function(error) {
          next(error);
        });
    }
  },
  saveMeal: function(req, res, next) {
    var token = req.headers['x-access-token'];
    var mealId = req.body;

    if (!token) {
      next(new Error('no token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function(foundUser) {
          //itrate through savedRecipes to find if meal preexists
          var foundMeal = false;
          for(var i = 0; i < foundUser.savedRecipes.length; i++){
            if(foundUser.savedRecipes[i].mealId === mealId.id){
              foundMeal = true;
            }
          }
          if (foundUser && foundMeal === false) {
            //create mealObj 
            var mealObj = {mealId: mealId.id, recipe: mealId};
            //add mealId.id for lookup and removal
            foundUser.savedRecipes.push(mealObj);
            Q.ninvoke(foundUser, 'save')
              .then(function() {
                res.status(200).send();
              })
              .fail(function(error) {
                res.status(400).send();
                next(error);
              });
          } else {
            res.status(401).send();
          }
        })
        .fail(function(error) {
          next(error);
        });
    }
  }, 
  removeFromSavedMeals: function(req, res, next) {
    var token = req.headers['x-access-token'];
    var mealId = req.body;

    if (!token) {
      next(new Error('no token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function(foundUser) {
          //iterate through savedRecipes to find index to remove from savedRecipes
          var mealIndex = false;
          for(var i = 0; i < foundUser.savedRecipes.length; i++){
            if(foundUser.savedRecipes[i].mealId === mealId.id){
              mealIndex = i;
            }
          }
          if (foundUser && mealIndex !== false) {
            //splice out meal
            foundUser.savedRecipes.splice(mealIndex, 1);
            Q.ninvoke(foundUser, 'save')
              .then(function() {
                res.status(200).send();
              })
              .fail(function(error) {
                res.status(400).send();
                next(error);
              });
          } else {
            res.status(401).send();
          }
        })
        .fail(function(error) {
          next(error);
        });
    }
  },
  saveDietPreferences: function(req, res, next) {
    var token = req.headers['x-access-token'];
    var dietPreferences = req.body.preferences;

    if (!token) {
      next(new Error('no token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function(foundUser) {
          if (foundUser) {
            foundUser.dietPreferences = dietPreferences;
            Q.ninvoke(foundUser, 'save')
              .then(function() {
                res.status(200).send();
              })
              .fail(function(err) {
                res.status(400).send();
                next(err);
              });
          } else {
            res.status(401).send();
          }
        })
        .fail(function(error) {
          next(error);
        });
    }
  },
  getDietPreferences: function(req, res, next) {
    var token = req.headers['x-access-token'];

    if (!token) {
      next(new Error('no token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function(foundUser) {
          if (foundUser) {
            var dietPreferences = foundUser.dietPreferences;
            res.status(200);
            res.json(dietPreferences);
          } else {
            res.status(401).send();
          }
        })
        .fail(function(error) {
          next(error);
        });
    }
  }
};
