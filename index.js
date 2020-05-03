var express = require("express");
var app = express();
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');


var dishRoutes = require("./routes/dishRouter.js");
var promoRoutes = require("./routes/promoRouter.js");
var leaderRoutes = require("./routes/leaderRouter.js");
var usersRouter = require("./routes/users.js");
var uploadRouter = require('./routes/uploadRouter');

var Dish = require("./models/dishes.js");
var Promo = require("./models/leaders.js");
var Leader = require("./models/promotions.js");


mongoose.connect('mongodb://127.0.0.1/node_examples',{ useNewUrlParser: true, useUnifiedTopology: true});

app.use(methodOverride("_method"));
app.use(bodyparser.json());

app.use(passport.initialize());
// app.use(passport.session());

// app.use(session({
// 	name: 'session-id',
// 	secret: '12345-67890-09876-54321',
// 	saveUninitialized: false,
// 	resave: false,
// 	store: new FileStore()
//   }));


app.use('/users', usersRouter);
app.use("/dishes", dishRoutes);
app.use("/promotions", promoRoutes);
app.use("/leaders", leaderRoutes);
app.use('/imageUpload',uploadRouter);


app.listen(3000,process.env.IP,function(){
	console.log("Server Started!");
});

  