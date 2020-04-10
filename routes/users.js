var express = require("express");
var bodyParser = require("body-parser");
var router = express.Router();
var User = require("../models/users");

router.use(bodyParser.json());

router.get("/",function(req,res){
    res.send("Listing all users");
});

router.post('/signup', function(req, res){
    User.findOne({username: req.body.username},function(user){
        if(user != null) {
            var err = new Error('User ' + req.body.username + ' already exists!');
            err.status = 403;
            next(err);
        }
        else {
            return User.create({
              username: req.body.username,
              password: req.body.password});
          }
        },function(err,user){
            if(err)
                console.log(err);
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});
            }   
        });
    });


  router.post('/login', function(req, res, next){
  
    if(!req.session.user) {
      var authHeader = req.headers.authorization;
      
      if (!authHeader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
      }
    
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var username = auth[0];
      var password = auth[1];
    
      User.findOne({username: username},function(err,user){
        
        if (user === null) {
            err = new Error('User ' + username + ' does not exist!');
            err.status = 403;
            return next(err);
          }
          else if (user.password !== password) {
            err = new Error('Your password is incorrect!');
            err.status = 403;
            return next(err);
          }
          else if (user.username === username && user.password === password) {
            req.session.user = 'authenticated';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end('You are authenticated!')
          }
          
        });
      }
      else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
      }
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