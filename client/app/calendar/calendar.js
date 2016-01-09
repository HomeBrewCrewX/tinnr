angular.module('tinnr.calendar', [])
  .controller('CalendarController', ['$scope', 'Calendar', function ($scope, Calendar){
    $scope.cols = 5;
    $scope.calendarMeals = [];
    $scope.offsets = 0;
    $scope.mealsOfDay = ['Breakfast', 'Lunch', 'Dinner'];
    $scope.daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    $scope.organizedMeals = {
      'Monday': [false, 0, null],
      'Tuesday': [false, 0, null],
      'Wednesday': [false, 0, null],
      'Thursday': [false, 0, null],
      'Friday': [false, 0, null],
      'Saturday': [false, 0, null],
      'Sunday': [false, 0, null]
    };

    $scope.organizeCalendarMeals = function(array){
      var m = $scope.mealsOfDay;
      for(var i = 0; i < array.length; i++){
        for(var j = 0; j < array[i].length; j++){
          var mealObj = array[i][j];
          for(var key in $scope.organizedMeals) {
            if(mealObj.selectedDay === key && $scope.mealsOfDay.indexOf(mealObj.selectedMeal) !== -1 ) {
              $scope.organizedMeals[key][$scope.mealsOfDay.indexOf(mealObj.selectedMeal)] = mealObj;
            }
          }
        }
      }
    };

    $scope.getCalendarMeals = function() {
      Calendar.getCalendarMeals()
        .then(function (res) {
          $scope.offsets = $scope.cols - (res.data.length % $scope.cols);
          $scope.calendarMeals = _.chunk(res.data, $scope.cols);
        })
        .then(function (){
          $scope.organizeCalendarMeals($scope.calendarMeals);
          console.log($scope.calendarMeals)
        })
        .catch(function (error) {
          console.log('Error fetching meals', error);
        });
    };

    $scope.removeMeal = function(meal) {
      console.log(meal, "line 48")
      Calendar.removeMeal(meal)
        .then(function (res) {
          $scope.alerts.push({type: 'success', msg: 'Meal has been removed from your calendar!'});
        })
        .catch(function (error) {
          $scope.alerts.push({type: 'danger', msg: 'Error removing meal from your calend`.'});
          console.log(' Error removing meal from your calendar', error);
        });
    };

    $scope.getCalendarMeals();

  }]);
