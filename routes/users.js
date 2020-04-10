var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var User = require("../models/users");
var passport = require('passport');


router.use(bodyParser.json());

router.get("/",function(req,res){
    res.send("Listing all users");
});

router.post('/signup', function(req, res){
    var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err,user){
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      passport.authenticate("local")(req,res,function(){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful!'});
      });
   });
});


router.post("/login", passport.authenticate("local"),function(req,res){
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
 });
        
  
  router.get('/logout', function(req, res){
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
  });
  
module.exports = router;