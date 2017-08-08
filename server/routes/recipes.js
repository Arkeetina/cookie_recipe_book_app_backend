const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');
const _ = require('lodash');

// Models
let Recipe = require('../models/recipe');

// GET single recipe
router.get('/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    console.log("ID isn't valid");
    return res.status(404).send();
  }

  Recipe.findOne({
    _id: id
  }).then((recipe) => {
    if(!recipe){
      return res.status(404).send();
    }
    res.status(200).send({recipe});
  }).catch((err) => {
    res.status(400).send();
  });
  
});

//GET all recipes
router.get('/', (req, res) => {
  Recipe.find().then((recipes) => {
    res.send({recipes});
  }, (err) => {
    res.status(400).send(err);
  })
});

// Add Submit POST Route
router.post('/add', (req, res) => {
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Recipe is required').notEmpty();
  req.checkBody('fileUpload','Image is required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();

  if(errors) {
    res.status(400).send(errors);
  } else {

  let recipe = new Recipe({
    title: req.body.title,
    author: req.body.author,
    body: req.body.body,
    fileUpload: req.body.fileUpload
  });

  recipe.save().then((doc) => {
      res.send(doc);

    }, (err) => {
      res.status(400).send(err)
    });
  }
});

// DELETE route 
router.delete('/:id', (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Recipe.findOneAndRemove({
    _id: id,
  }).then((recipe) => {
    if (!recipe) {
      return res.status(404).send();
    }

    res.send({recipe});
  }).catch((err) => {
    res.status(400).send();
  });
});

// PATCH route
router.patch('/:id/edit', (req, res) => {
  let id = req.params.id;
  let body = _.pick(req.body, ['title', 'author', 'body', 'fileUpload']);

  if (!ObjectID.isValid(id)) {
    console.log('id isnt valid');
    return res.status(404).send();
  }

  Recipe.findOneAndUpdate({
    _id: id,
  }, {$set: body}, {new: true}).then((recipe) => {
    if(!recipe) {
      console.log('error is in recipe');
      return res.status(404).send()
    }

    res.send({recipe});
  }).catch((err) => {
    console.log('something else');
    res.status(400).send();
  });
});


module.exports = router;