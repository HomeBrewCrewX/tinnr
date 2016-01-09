var User = require('./userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');
//for development
var sendgridAPIKEY = require('./emailAPIKey.js');
var sendgrid  = require('sendgrid')(sendgridAPIKEY.apiKEY);

//for deployment
//var sendgrid  = require('sendgrid')(process.env.SENDGRIDKEY);


module.exports = {
	getList: function(req, res, next) {
		//token to get username
	    var token = req.headers['x-access-token'];
	    var user = jwt.decode(token, 'secret');

	    //check for login with token
	    if (!token) {
	      next(new Error('no token'));
	    } else {
	    	console.log('testcontroller', req.body);
	    	//create list with req.body
	    	var list = req.body.join(', ');
	    	//&&send with sendgrid
			sendgrid.send({
				  to:       user.username,
				  from:     'noreply@tinnrplusplus.com',
				  subject:  'Your Meal Ingredients',
				  text:     list
				}, function(err, json) {
				  if (err) { return console.error(err); }
				  console.log(json);
				})
	    }
	  }
};