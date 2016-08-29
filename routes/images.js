var express = require('express');
var router = express.Router();
var favicon = require('serve-favicon');
var fs = require('fs');
var mongoose = require('mongoose');
var Img = require('../models/Image.js');


/* GET /todos listing. */
router.get('/', function(req, res, next) {
  Img.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
});

/* POST /todos */
router.post('/', function(req, res, next) {
  Img.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /todos/id */
router.get('/:id', function(req, res, next) {
  Img.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /todos/:id */
router.put('/:id', function(req, res, next) {
 console.log('data image reciveed'+JSON.stringify(req.body));
  var newRequest=req.body;
  Img.findByIdAndUpdate(req.params.id, {$set:{name:req.body.name, img_src:req.body.img_src, note:req.body.note}}, function (err, post) {
      res.json(post);
  });
});



/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Img.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    console.log("req.params.id, req.body :" + JSON.stringify(req.params.id)+ ', '+  JSON.stringify(req.body));
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
