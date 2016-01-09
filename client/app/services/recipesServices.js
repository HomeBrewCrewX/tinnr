angular.module('tinnr.recipesServices', [])
  .factory('Recipes', ['$http', function($http) {
    var recipes = {};

    recipes.getRecipes = function (params) {
      return $http({
        method: 'GET',
        url: '/api/recipes',
        params: params
      })
      .then(function (res) {
        return res.data;
      }, function (res) {
        console.error('Error: ', res);
      });
    };

    recipes.saveRecipe = function (recipe) {
      return $http({
        method: 'POST',
        url: '/api/recipes',
        data: recipe
      })
      .then(function (res) {
        return res.data;
      }, function (res) {
        console.error('Error: ', res);
      });
    };

    recipes.showRecipes = function () {
      return $http({
        metod: 'GET',
        url: '/api/recipes',
      })
      .then(function (res) {
        return res.data;
      }, function (res) {
        console.error('Error: ', res);
      });
    };

    return recipes;
  }]);
