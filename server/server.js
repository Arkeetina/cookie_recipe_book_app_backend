require('./config/config.js');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const {ObjectID} = require('mongodb');

let {mongoose} = require('./db/mongoose');
let db = mongoose.connection;

// Check connection
db.once('open', () =>{
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', (err) => {
  console.log(err);
});

// Init APP
let app = express();
const port = process.env.PORT;

// Models
let Recipe = require('./models/recipe');
let {Admin} = require('./models/admin');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// CORS
app.use(cors()); 

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Routes files
let recipes = require('./routes/recipes');
app.use('/recipes', recipes);
let admin = require('./routes/admin');
app.use('/admin', admin);
//
app.listen(port, () => {
  console.log(`Listening on the port ${port}`);
});

module.exports = {app};