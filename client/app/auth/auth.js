angular.module('tinnr.auth', [])
  .controller('AuthController', ['$rootScope', '$scope', '$window', '$state', 'Auth', 'User', function ($rootScope, $scope, $window, $state, Auth, User) {
    $scope.user = User.data;
    $scope.error = null;

    $scope.signin = function () {
      Auth.signin($scope.user)
        .then(function (user) { 
          User.data = user;
          $rootScope.username = user.username;
          console.log(user);

          $window.localStorage.setItem('com.tinnr', user.token);
          $state.go('meals');
        })
        .catch(function (error) {
          $scope.alerts.push({type: 'danger', msg: error.data.error});
          console.error(error);
        });
    };

    $scope.signup = function () {
      Auth.signup($scope.user)
        .then(function (token) {
          User.data.password = null;
          $window.localStorage.setItem('com.tinnr', token);
          $state.go('meals');
        })
        .catch(function (error) {
          $scope.alerts.push({type: 'danger', msg: error.data.error});
          console.error(error);
        });
    };
  }]);
