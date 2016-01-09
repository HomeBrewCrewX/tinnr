var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var utils = require('./utils.js');

module.exports = function(app, express) {
  var usersRouter = express.Router();
  var recipesRouter = express.Router();

  //Sergey's Calendar//
  var calendarRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '/../../client')));

  app.use('/api/users', usersRouter);
  app.use('/api/recipes', recipesRouter);

  //Sergey's Calendar//
  app.use('/api/calendar', calendarRouter);

  app.use('*', function(req, res) {
    res.status(404).send('404: Page not found');
  });

  require('../user/userRoutes.js')(usersRouter);
  require('../recipes/recipeRoutes.js')(recipesRouter);

  //Sergey's Calendar//
  require('../calendar/calendarRoutes.js')(calendarRouter);

  app.use(utils.logError);
  app.use(utils.handleError);
};
