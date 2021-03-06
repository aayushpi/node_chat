
/**
 * Module dependencies.
 */

var express = require('express')
  , route = require('./config/route')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoStore = require('connect-mongo')(express)
  , mongoose = require('mongoose');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({
   // secret: config.sessionSecret,
   store: new mongoStore({
     url: 'mongodb://localhost/chat_DEV',
     collection: 'sessions'
   })
 }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));

  app.locals.title = "William Chat-ner";
});

app.configure('development', function(){
  app.use(express.errorHandler());
  mongoose.connect('mongodb://localhost/chat_DEV');
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var GoogleStrategy = require('passport-google').Strategy;

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {
    var UserModel = require('./models/usermodel');
    profile.email = profile.emails[0].value;
    UserModel.findOneAndUpdate({email:profile.email}, {$set:profile, $inc:{logins:1}}, {upsert:true}, done);
  }
));

route(app);
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
 io.sockets.on('connection', function (socket) {
  socket.emit( 'message', { message: 'Connected', from: 'system' });
  socket.on( 'join', function(data){
    var RoomsModel = require('./models/roomsmodel');  
    RoomsModel.findById(data.room, function (err, room) {
      if (!err && room) {
        socket.join(room._id);
        socket.broadcast.to(data.room).emit('message', {message:'<p style="color:red;">'+ data.from + " joined the room.</p>", from: "system"});
        socket.emit( 'message', { message:'<p style="color:red;">'+  'You have joined room ' + room.title, from: 'system' });
      }
    });
  });
  socket.on('message', function(data){
    socket.broadcast.to(data.room).emit('message', data);
  });
});

