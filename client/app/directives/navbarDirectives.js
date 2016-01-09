angular.module('tinnr.navbarDirectives', [])
  .directive('navbar', ['Auth','User', function(Auth, User) {
    return {
      restrict: 'E',
      templateUrl: 'app/partials/_navbar.html',
      controller: function($scope, $rootScope) {
        $scope.isLoggedIn = Auth.isAuth;
        $scope.signout = Auth.signout;
        $rootScope.isNavbarCollapsed = true;
      }
    };
  }]);
