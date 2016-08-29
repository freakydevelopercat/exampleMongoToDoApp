var express = require('express');
var router = express.Router();
var favicon = require('serve-favicon');
var fs = require('fs');
var mongoose = require('mongoose');
var Todo = require('../models/Todo.js');


/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Todo.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  console.log('req create:'+ JSON.stringify(req.body));
  Todo.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Todo.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */

router.put('/:id', function(req, res, next) {
  //update all fields
  console.log("req bdy:"+JSON.stringify(req.body.state));
  Todo.findByIdAndUpdate(req.params.id, {$set:{name:req.body.name, completed:req.body.completed, note:req.body.note, state:req.body.state}}, function (err, post) {
      res.json(post);
  });
});



/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Todo.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    console.log("req.params.id, req.body :" + JSON.stringify(req.params.id)+ ', '+  JSON.stringify(req.body));
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
