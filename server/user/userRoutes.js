var userController = require('./userController.js');
var calendarController = require('../calendar/calendarController.js')
var sendGridController = require('./sendGridController.js');

module.exports = function(app) {
  app.post('/signin', userController.signin);
  app.post('/signup', userController.signup);
  app.post('/signedin', userController.checkAuth);
  app.get('/meals', userController.getSavedMeals);
  app.post('/meals', userController.saveMeal);
  app.post('/preferences', userController.saveDietPreferences);
  app.get('/preferences', userController.getDietPreferences);
  app.post('/calendar', calendarController.addCal);
  app.get('/calendar', calendarController.getCalendarMeals);
  app.post('/calendar/remove', calendarController.removeMeal);
  //email notification route handler
  app.post('/email', sendGridController.getList);
  //remove meal route
  app.post('/remove', userController.removeFromSavedMeals);
};
