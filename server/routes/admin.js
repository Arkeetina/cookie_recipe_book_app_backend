const express = require('express');
const router = express.Router();
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {authenticate} = require('../middleware/authenticate');

// Models
let {Admin} = require('../models/admin');

// Registration route 
router.post('/register', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  let admin = new Admin(body);

  admin.save().then(() => {
    return admin.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(admin);
  }).catch((err) => {
    res.status(400).send(err);
  })
});

//Login route
router.post('/login', (req, res) => {
  let body = _.pick(req.body, ['email', 'password']);
  
    Admin.findByCredentials(body.email, body.password).then((admin) => {
      return admin.generateAuthToken().then((token) => {
        res.header("Access-Control-Allow-Headers", "x-auth");
        res.header("Access-Control-Expose-Headers", "x-auth");
        res.header('x-auth', token).send(admin);
      });
    }).catch((err) => {
        res.status(400).send({error: "Incorrect login info"});
    });
});

router.delete('/token', authenticate, (req, res) => {
  req.admin.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  })
}); 

module.exports = router;