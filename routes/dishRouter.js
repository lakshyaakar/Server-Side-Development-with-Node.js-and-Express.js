var express = require("express");
var router = express.Router();
var Dish = require("../models/dishes.js");
var authenticate = require('../authenticate.js');

router.get("/",function(req,res){
  Dish.find({})
  .populate('comments.author')
  .then((dishes) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dishes);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/', authenticate.verifyUser, function(req, res){
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

router.put('/', authenticate.verifyUser, function(req, res){
  res.statusCode = 403;
  res.send('PUT operation not supported on /dishes');
});

router.delete('/', authenticate.verifyUser, function(req, res){
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

router.get("/:dishId",function(req,res){
  Dish.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(dish);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/:dishId', authenticate.verifyUser, function(req, res){
  res.statusCode = 403;
  res.send('POST operation not supported on /dishes/'+ req.params.dishId);
});

router.put('/:dishId', authenticate.verifyUser, function(req, res){
  Dish.findByIdAndUpdate(req.params.dishId, {
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

router.delete('/:dishId', authenticate.verifyUser, function(req, res){
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

router.get('/:dishId/comments', (req,res,next) => {
  Dish.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish) => {
      if (dish != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments);
      }
      else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/:dishId/comments',authenticate.verifyUser, (req, res, next) => {
  Dish.findById(req.params.dishId)
  .then((dish) => {
      if (dish != null) {
          req.body.author = req.user._id;
          dish.comments.push(req.body);
          dish.save()
          .then((dish) => {
              Dish.findById(dish._id)
              .populate('comments.author')
              .then((dish) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(dish);
              })            
          }, (err) => next(err));
      }
      else {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
      }
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.put('/:dishId/comments',authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
});

router.delete('/:dishId/comments',authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});


router.get('/:dishId/comments/:commentId', (req,res,next) => {
  Dish.findById(req.params.dishId)
  .populate('comments.author')    
  .then((dish) => {
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(dish.comments.id(req.params.commentId));
      }
      else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
      }
      else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);            
      }
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/:dishId/comments/:commentId',authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
});

router.put('/:dishId/comments/:commentId',authenticate.verifyUser, (req, res, next) => {
  Dish.findById(req.params.dishId)
  .then((dish) => {
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
          if (req.body.rating) {
              dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
              dish.comments.id(req.params.commentId).comment = req.body.comment;                
          }
          dish.save()
          .then((dish) => {
              Dish.findById(dish._id)
              .populate('comments.author')
              .then((dish) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(dish);  
              })              
          }, (err) => next(err));
      }
      else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
      }
      else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);            
      }
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.delete('/:dishId/comments/:commentId',authenticate.verifyUser, (req, res, next) => {
  Dish.findById(req.params.dishId)
  .then((dish) => {
      if (dish != null && dish.comments.id(req.params.commentId) != null) {

          dish.comments.id(req.params.commentId).remove();
          dish.save()
          .then((dish) => {
              Dish.findById(dish._id)
              .populate('comments.author')
              .then((dish) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(dish);  
              })               
          }, (err) => next(err));
      }
      else if (dish == null) {
          err = new Error('Dish ' + req.params.dishId + ' not found');
          err.status = 404;
          return next(err);
      }
      else {
          err = new Error('Comment ' + req.params.commentId + ' not found');
          err.status = 404;
          return next(err);            
      }
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = router;
