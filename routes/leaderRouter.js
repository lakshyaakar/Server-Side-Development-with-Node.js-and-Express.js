var express = require("express");
var router = express.Router();
var Leader = require("../models/leaders.js");
var authenticate = require('../authenticate.js');


router.get("/",function(req,res){
	Leader.find({},function(err,leader){
    if(err)
      console.log("Leaders not found");
    else{
      res.send(leader);
      console.log(leader);
    }
  });
});

router.post('/', authenticate.verifyUser, function(req, res){
  Leader.create(req.body, function(err,leader){
      if(err)
        console.log(err);
      else{
        res.send(leader);
        console.log(leader);
      }  
  });
});

router.put('/', authenticate.verifyUser, function(req, res){
  res.statusCode = 403;
  res.send('PUT operation not supported on /leaders');
});

router.delete('/', authenticate.verifyUser, function(req, res){
    Leader.remove({},function(err,leader){
      if(err)
        console.log(err);
      else{
        res.send("Removed all leaders");
        console.log("Removed all leaders");
      }
    });
});

router.get("/:leaderId",function(req,res){
    Leader.findById(req.params.leaderId, function(err,foundLeader){
      if(err)
        console.log("Leader not found");
      else{
        res.send(foundLeader);
        console.log(foundLeader);
      }
    });
});

router.post('/:leaderId', authenticate.verifyUser, function(req, res){
  res.statusCode = 403;
  res.send('POST operation not supported on /leaders/'+ req.params.leaderId);
});

router.put('/:leaderId', authenticate.verifyUser, function(req, res){
  Dishes.findByIdAndUpdate(req.params.dishId, {
    $set: req.body
},function(err,updatedLeader){
    if(err)
      console.log(err);
    else{
      res.send(updatedLeader);
      console.log(updatedLeader);
    }
  });
});

router.delete('/:leaderId', authenticate.verifyUser, function(req, res){
  Leader.findByIdAndRemove(req.params.leaderId, function(err,leader){
    if(err)
      console.log(err);
    else{
      res.send("Removed leader " + req.params.leaderId);
      console.log("Removed leader " + req.params.leaderId);
    }

    });
});

module.exports = router;
