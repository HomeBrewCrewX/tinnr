angular.module('tinnr.recipes', ['hmTouchEvents'])
  .controller('RecipesController', ['$scope', 'Recipes', 'Meals', 'Auth', 'User', function ($scope, Recipes, Meals, Auth, User) {
    $scope.currentIndex = 0;
    $scope.recipes = [];
    $scope.preferences = User.data.preferences;
    $scope.isLoggedIn = Auth.isAuth;

    $scope.getRecipes = function (params) {
      Recipes.getRecipes(params)
        .then(function (data) {
          $scope.recipes = JSON.parse(data).matches;
        })
        .catch(function (error) {
          console.error('Error fetching recipes: ', error);  
        });
    };

    $scope.isCurrentRecipe = function (index) {
      return $scope.currentIndex === index;
    };

    $scope.nextRecipe = function () {
      $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.recipes.length - 1;
    };

    $scope.saveRecipe = function () {
      if (Auth.isAuth()) {
        Meals.saveMeal($scope.recipes[$scope.currentIndex]);
        Recipes.saveRecipe($scope.recipes[$scope.currentIndex]);
      }
      
      $scope.nextRecipe();
    };

    $scope.savePreferences = function () {
      User.savePreferences()
        .then(function (data) {
          $scope.alerts.push({type: 'success', msg: 'Your preferences have been saved!'});
        })
        .catch(function (error) {
          $scope.alerts.push({type: 'danger', msg: 'Error saving preferences.'});
          console.error('Error saving preferences: ', error);  
        });
    };


    $scope.getRecipes($scope.preferences);
  }]);
