var User = require('./userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');
var sendgridAPIKEY = require('./emailAPIKey.js');
var sendgrid  = require('sendgrid')(sendgridAPIKEY.apiKEY);

module.exports = {
	getList: function(req, res, next) {
	    var token = req.headers['x-access-token'];
	    var user = jwt.decode(token, 'secret');

	    if (!token) {
	      next(new Error('no token'));
	    } else {
	    	console.log('testcontroller', req.body);
	    	var list = req.body.join(', ');
				sendgrid.send({
					  to:       user.username,
					  from:     'noreply@tinnr.com',
					  subject:  'Your Meal Ingredients',
					  text:     list
					}, function(err, json) {
					  if (err) { return console.error(err); }
					  console.log(json);
					})
	    }
	  }
};