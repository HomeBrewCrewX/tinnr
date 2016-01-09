angular.module('tinnr', [
  'tinnr.authServices',
  'tinnr.usersServices',
  'tinnr.recipesServices',
  'tinnr.mealsServices',
  'tinnr.calendarServices', //Calendar//
  'tinnr.calendar',   //Calendar//
  'tinnr.navbarDirectives',
  'tinnr.alertsDirectives',
  'tinnr.auth',
  'tinnr.landing',
  'tinnr.recipes',
  'tinnr.meals',
  'ui.router',
  'ui.bootstrap'
])

.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('signup', {
      templateUrl: 'app/auth/signup.html',
      url: '/signup',
      controller: 'AuthController'
    })
    .state('signin', {
      templateUrl: 'app/auth/signin.html',
      url: '/signin',
      controller: 'AuthController'
    })
    .state('landing', {
      templateUrl: 'app/landing/landing.html',
      url: '/',
      controller: 'LandingController'
    })
    .state('recipes', {
      templateUrl: 'app/recipes/recipes.html',
      url: '/recipes',
      controller: 'RecipesController'
    })
    .state('meals', {
      templateUrl: 'app/meals/meals.html',
      url: '/meals',
      controller: 'MealsController',
      authenticate: true
    })
    .state('calendar', {
      templateUrl: 'app/calendar/calendar.html',
      url: '/calendar',
      controller: 'CalendarController',
      // authenticate: true
    })
    ;

  $httpProvider.interceptors.push('AttachTokens');
})

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.tinnr');

      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }

      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };

  return attach;
})

.run(function ($rootScope, $state, Auth) {
  $rootScope.$state = $state;

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    $rootScope.isNavbarCollapsed = true;

    if (toState && toState.authenticate && !Auth.isAuth()) {
      event.preventDefault();
      $state.go('signin');
    } else if (((toState.name === 'signup') || (toState.name === 'signin')) && Auth.isAuth()) {
      event.preventDefault();
      $state.go('meals');
    }
  });
});
