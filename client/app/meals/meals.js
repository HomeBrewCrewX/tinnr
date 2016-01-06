angular.module('tinnr.meals', [])
  .controller('MealsController', ['$scope', 'Meals', function ($scope, Meals) {
    $scope.cols = 4;
    $scope.meals = [];
    $scope.offsets = 0;

    $scope.getMeals = function() {
      Meals.getMeals()
        .then(function (res) {
          $scope.offsets = $scope.cols - (res.data.length % $scope.cols);
          $scope.meals = _.chunk(res.data, $scope.cols);
        })
        .catch(function (error) {
          console.log('Error fetching meals', error);
        });
    };

    $scope.getList = function(ingredients) {
      Meals.getList(ingredients);
    }

    $scope.getMeals();
  }]);