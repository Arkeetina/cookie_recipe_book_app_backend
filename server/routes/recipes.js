const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {authenticate} = require('../middleware/authenticate');

// Models
let Recipe = require('../models/recipe');

// GET single recipe
router.get('/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send({error: "ID isn't valid"});
  }

  Recipe.findOne({
    _id: id
  }).then((recipe) => {
    if(!recipe){
      return res.status(404).send({error: "Recipe not found"});
    }
    res.status(200).send({recipe});
  }).catch((err) => {
    res.status(400).send({error: "400"});
  });
  
});

//GET all recipes
router.get('/', (req, res) => {
  Recipe.find().then((recipes) => {
    res.send({recipes});
  }, (err) => {
    res.status(400).send({error: "Bad request"});
  })
});

// Add Submit POST Route
router.post('/add', authenticate, (req, res) => {
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
      res.status(400).send({error: "Bad request"})
    });
  }
});

// DELETE route 
router.delete('/:id', authenticate, (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({error: "ID isn't valid"})
  }

  Recipe.findOneAndRemove({
    _id: id,
  }).then((recipe) => {
    if (!recipe) {
      return res.status(404).send({error: "Recipe not found"});
    }

    res.send({recipe});
  }).catch((err) => {
    res.status(400).send(err);
  });
});

// PATCH route
router.patch('/:id/edit', authenticate, (req, res) => {
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
    res.status(400).send(err);
  });
});


module.exports = router;