const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');

// Models
let Recipe = require('../models/recipe');

// GET single recipe
router.get('/:id', (req, res) => {
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    // консоль лог!? переписать!!!
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

  //Get Errors
  let errors = req.validationErrors();

  if(errors) {
    res.status(400).send(errors);
  } else {
    let recipe = new Recipe({
      title: req.body.title,
      author: req.body.author,
      body: req.body.body
    });

    recipe.save().then((doc) => {
      res.send(doc);
      req.flash('success', 'Recipe Added');
      // надо ли оставлять редирект? 
      res.redirect('/');
    }, (err) => {
      res.status(400).send(err)
    });
  }
});

module.exports = router;