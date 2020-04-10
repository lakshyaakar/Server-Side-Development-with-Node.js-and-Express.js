var express = require("express");
var router = express.Router();
var Leader = require("../models/leaders.js");

router.get("/leaders",function(req,res){
	Leader.find({},function(err,leader){
    if(err)
      console.log("Leaders not found");
    else{
      res.send(leader);
      console.log(leader);
    }
  });
});

router.post('/leaders', function(req, res){
  Leader.create(req.body, function(err,leader){
      if(err)
        console.log(err);
      else{
        res.send(leader);
        console.log(leader);
      }  
  });
});

router.put('/leaders', function(req, res){
  res.statusCode = 403;
  res.send('PUT operation not supported on /leaders');
});

router.delete('/leaders', function(req, res){
    Leader.remove({},function(err,leader){
      if(err)
        console.log(err);
      else{
        res.send("Removed all leaders");
        console.log("Removed all leaders");
      }
    });
});

router.get("/leaders/:leaderId",function(req,res){
    Leader.findById(req.params.leaderId, function(err,foundLeader){
      if(err)
        console.log("Leader not found");
      else{
        res.send(foundLeader);
        console.log(foundLeader);
      }
    });
});

router.post('/leaders/:leaderId', function(req, res){
  res.statusCode = 403;
  res.send('POST operation not supported on /leaders/'+ req.params.leaderId);
});

router.put('/leaders/:leaderId', function(req, res){
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

router.delete('/leaders/:leaderId', function(req, res){
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
