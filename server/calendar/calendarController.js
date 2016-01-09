var _ = require('underscore');
// var db = require('../data.js'); //May not need
var Calendar = require('./calendarModel.js');
var request = require('request');
var url = require('url');
var Q = require('q');
var jwt = require('jwt-simple');
var User = require('../user/userModel.js');


module.exports = {
  getCalendarMeals: function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next (new Error('no token'))
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function(foundUser) {
          if (foundUser) {
            var recipes = [];
            for(var i = 0; i < foundUser.calendarRecipes.length; i++) {
              recipes.push(foundUser.calendarRecipes[i].recipe);
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
  addCal: function(req, res, next) {
    var token = req.headers['x-access-token'];
    var mealId = req.body;

    if (!token) {
      next(new Error('no token'));
    } else {
      var user = jwt.decode(token, 'secret');
      var findUser = Q.nbind(User.findOne, User);
      findUser({username: user.username})
        .then(function(foundUser) {
          var foundMeal = false;
          for(var i = 0; i < foundUser.calendarRecipes.length; i++){
           if(foundUser.calendarRecipes[i].mealId === mealId.mealId){
             foundMeal = true;
           }
         }
         if (foundUser && foundMeal === false) {
           //create mealObj 
           var mealObj = {mealId: mealId.id, recipe: mealId};
           //add mealId.mealId for lookup and removal
           foundUser.calendarRecipes.push(mealObj);
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
  removeMeal: function(req, res, next) {
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
          for(var i = 0; i < foundUser.calendarRecipes.length; i++){
            console.log(foundUser.calendarRecipes[0], "line 90")
            if(foundUser.calendarRecipes[i].mealId === mealId.id){
              mealIndex = i;
            }
          }
          console.log('mealIndex', mealIndex)
          if (foundUser && mealIndex !== false) {
            //splice out meal
            foundUser.calendarRecipes.splice(mealIndex, 1);
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
  }
}
