var express = require("express");
var router = express.Router();
var Dish = require("../models/dishes.js");

router.get("/dishes",function(req,res){
	Dish.find({},function(err,dish){
    if(err)
      console.log("Dishes not found");
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send(dish);
      console.log(dish);
    }
  });
});

router.post('/dishes', function(req, res){
  Dish.create(req.body, function(err,dish){
      if(err)
        console.log(err);
      else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send(dish);
        console.log(dish);
      }  
  });
});

router.put('/dishes', function(req, res){
  res.statusCode = 403;
  res.send('PUT operation not supported on /dishes');
});

router.delete('/dishes', function(req, res){
    Dish.remove({},function(err,dish){
      if(err)
        console.log(err);
      else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send("Removed all dishes");
        console.log("Removed all dishes");
      }
    });
});

router.get("/dishes/:dishId",function(req,res){
    Dish.findById(req.params.dishId, function(err,foundDish){
      if(err)
        console.log("Dish not found");
      else{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.send(foundDish);
        console.log(foundDish);
      }
    });
});

router.post('/dishes/:dishId', function(req, res){
  res.statusCode = 403;
  res.send('POST operation not supported on /dishes/'+ req.params.dishId);
});

router.put('/dishes/:dishId', function(req, res){
  Dishes.findByIdAndUpdate(req.params.dishId, {
    $set: req.body
},function(err,updatedDish){
    if(err)
      console.log(err);
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send(updatedDish);
      console.log(updatedDish);
    }
  });
});

router.delete('/dishes/:dishId', function(req, res){
  Dish.findByIdAndRemove(req.params.dishId, function(err,dish){
    if(err)
      console.log(err);
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.send("Removed dish " + req.params.dishId);
      console.log("Removed dish " + req.params.dishId);
    }

    });
});


module.exports = router;
