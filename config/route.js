var PagesController = require('../controllers/pagescontroller')
,		AuthController = require('../controllers/authcontroller')
,		RoomsController = require('../controllers/roomscontroller')
,		passport = require('passport');


var authUser = function (req, res, next) {

	if (req.url.match('^/(stylesheets|js|images)')) return next();
	if (req.session.passport.user) return next();
	res.redirect('/login');

};

var dontAuthUser= function (req, res, next) {

  console.log("this is me");

};
	

var route = function (app) {
  app.get('/login', AuthController.login);
  
  // Redirect the user to Google for authentication.  When complete, Google
	// will redirect the user back to the application at
	//     /auth/google/return
	app.get('/auth/google', passport.authenticate('google'));

	// Google will redirect the user to this URL after authentication.  Finish
	// the process by verifying the assertion.  If valid, the user will be
	// logged in.  Otherwise, authentication has failed.
	app.get('/auth/google/return', 
	  passport.authenticate('google', { successRedirect: '/',
                                      failureRedirect: '/login' }));
  app.all('*', authUser);
  app.get('/', PagesController.home);

  app.get('/rooms', RoomsController.index);
  app.get('/rooms/:id', RoomsController.show);
  app.post('/rooms', RoomsController.create);
  app.put('/rooms/:id', RoomsController.update);
  app.delete('/rooms/:id', RoomsController.delete);

};


module.exports = route;
