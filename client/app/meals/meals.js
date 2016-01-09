angular.module('tinnr.meals', [])

  .controller('MealsController', ['$scope', 'Meals', '$window', 'Calendar' ,function ($scope, Meals, $window, Calendar) {
    $scope.cols = 4;
    $scope.meals = [];
    $scope.offsets = 0;
    $scope.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    $scope.selectedDay = '';
    $scope.threeMeals = ['Breakfast', 'Lunch', 'Dinner']
    $scope.selectedDay = '';
    

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

    $scope.addCal = function(meal){
      meal.selectedDay = $scope.selectedDay;
      meal.selectedMeal = $scope.selectedMeal;
      Calendar.addCal(meal)
        .then(function (res) {
          $scope.alerts.push({type: 'success', msg: 'Meal has been added to your calendar!'});
        })
        .catch(function (error) {
          $scope.alerts.push({type: 'danger', msg: 'Error saving preferences.'});
          console.log(' Error saving meal to calendar', error);
        });
    };

    $scope.getSelectedDay = function(day) {
      $scope.selectedDay = day;
      console.log($scope.selectedDay);
    };

    $scope.getSelectedMeal = function(meal) {
      $scope.selectedMeal = meal;
      console.log($scope.selectedMeal);
    };

    $scope.getList = function(ingredients) {
      //send ingredients to server via mealservices
      Meals.getList(ingredients);
    };

    $scope.removeMeal = function(meal) {
      //send meal to remove to server
      Meals.removeMeal(meal);
      $window.location.reload();
    };

    $scope.getMeals();
  }]);
