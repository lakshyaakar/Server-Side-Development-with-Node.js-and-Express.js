var express = require("express");
var router = express.Router();
var Promo = require("../models/promotions.js");

router.get("/promotions",function(req,res){
	Promo.find({},function(err,promos){
    if(err)
      console.log("Promos not found");
    else{
      res.send(promos);
      console.log(promos);
    }
  });
});

router.post('/promotions', function(req, res){
  Promo.create(req.body, function(err,promo){
      if(err)
        console.log(err);
      else{
        res.send(promo);
        console.log(promo);
      }  
  });
});

router.put('/promotions', function(req, res){
  res.statusCode = 403;
  res.send('PUT operation not supported on /promotions');
});

router.delete('/promotions', function(req, res){
    Promo.remove({},function(err,promos){
      if(err)
        console.log(err);
      else{
        res.send("Removed all promotions");
        console.log("Removed all promotions");
      }
    });
});

router.get("/promotions/:promoId",function(req,res){
    Promo.findById(req.params.promoId, function(err,foundPromo){
      if(err)
        console.log("Promotion not found");
      else{
        res.send(foundPromo);
        console.log(foundPromo);
      }
    });
});

router.post('/promotions/:promoId', function(req, res){
  res.statusCode = 403;
  res.send('POST operation not supported on /promotions/'+ req.params.promoId);
});

router.put('/promotions/:promoId', function(req, res){
  Dishes.findByIdAndUpdate(req.params.dishId, {
    $set: req.body
},function(err,updatedPromo){
    if(err)
      console.log(err);
    else{
      res.send(updatedPromo);
      console.log(updatedPromo);
    }
  });
});

router.delete('/promotions/:promoId', function(req, res){
  Promo.findByIdAndRemove(req.params.promoId, function(err,promo){
    if(err)
      console.log(err);
    else{
      res.send("Removed promo " + req.params.promoId);
      console.log("Removed promo " + req.params.promoId);
    }

    });
});

module.exports = router;
