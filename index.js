var express = require("express");
var app = express();
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var session = require('express-session');
var FileStore = require('session-file-store')(session);

app.use(session({
	name: 'session-id',
	secret: '12345-67890-09876-54321',
	saveUninitialized: false,
	resave: false,
	store: new FileStore()
  }));

  function auth (req, res, next) {
    console.log(req.session);

    if (!req.session.user) {
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');                        
            err.status = 401;
            next(err);
            return;
        }
        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            req.session.user = 'admin';
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
        }
    }
    else {
        if (req.session.user === 'admin') {
            console.log('req.session: ',req.session);
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
}  
  app.use(auth);
  
var dishRoutes = require("./routes/dishRouter.js");
var promoRoutes = require("./routes/promoRouter.js");
var leaderRoutes = require("./routes/leaderRouter.js");

var Dish = require("./models/dishes.js");
var Promo = require("./models/leaders.js");
var Leader = require("./models/promotions.js");

mongoose.connect('mongodb://127.0.0.1/node_examples',{ useNewUrlParser: true, useUnifiedTopology: true});

app.use(methodOverride("_method"));
app.use(bodyparser.json());
app.use(dishRoutes);
app.use(promoRoutes);
app.use(leaderRoutes);


app.listen(3000,process.env.IP,function(){
	console.log("Server Started!");
});

  