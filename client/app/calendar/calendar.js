angular.module('tinnr.calendar', [])
  .controller('CalendarController', ['$scope', 'Calendar', function ($scope, Calendar){
    $scope.cols = 5;
    $scope.calendarMeals = [];
    $scope.offsets = 0; 

    $scope.getCalendarMeals = function() {
      Calendar.getCalendarMeals()
        .then(function (res) {
          $scope.offsets = $scope.cols - (res.data.length % $scope.cols);
          $scope.calendarMeals = _.chunk(res.data, $scope.cols);
          console.log($scope.calendarMeals, "calMeal")
        })
        .catch(function (error) {
          console.log('Error fetching meals', error);
        });
    };

    $scope.removeCalendarMeal = function(meal) {
      Calendar.removeCalendarMeal(meal);
    };

    $scope.getCalendarMeals();

  }]);
