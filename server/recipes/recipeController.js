var _ = require('underscore');
var db = require('../data.js');
var Recipe = require('./recipeModel.js');
var request = require('request');
var url = require('url');
var Q = require('q');
// commented out for deployment 
// uncomment for development
var apiInfo = require('./apiKeys.js');

module.exports = {
  getRecipes: function(req, res, next) {
    // insert api id and api password
    var YUMMLY_API_ID = process.env.YUMMLY_API_ID || apiInfo.API_ID;
    var YUMMLY_API_KEY = process.env.YUMMLY_API_KEY || apiInfo.API_KEY;
    var params = url.parse(req.url).query;

    if (url.parse(req.url).query) {
      var apiUrl = 'http://api.yummly.com/v1/api/recipes?_app_id=' + YUMMLY_API_ID + '&_app_key=' + YUMMLY_API_KEY + '&' + params + '&requirePictures=true';

      request(apiUrl, function(err, response, body) {
        if (err) {
          res.status(401).send();
          next(err);
        } else {
          res.json(body);
        }
      });
    } else {
      // shuffles recipes stored in data.js
      db.matches = _.shuffle(db.matches);
      res.status(200);
      res.json(JSON.stringify(db));
    }
  },
  saveRecipe: function(req, res, next) {
    var id = req.body.id;

    var findRecipe = Q.nbind(Recipe.findOne, Recipe);
    findRecipe({id: id})
      .then(function(recipe) {
        // if recipe exists, we want to iterate the number of saves
        // to keep track of popularity
        if (recipe) {
          recipe.numberOfSaves++;
          recipe.save()
            .then(function() {
              res.status(200).send();
            })
            .catch(function(err) {
              res.status(400).send();
              next(err);
            });
        } else {
          var newRecipe = new Recipe(req.body);
          newRecipe.save()
            .then(function() {
              res.status(200).send();
            })
            .catch(function(err) {
              res.status(400).send();
              next(err);
            });
        }
      });
  }
};
