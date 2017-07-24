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

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// CORS
app.use(cors()); 
// set up public folder
app.use(express.static(path.join(__dirname, '../public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use( (req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

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

//
app.listen(port, () => {
  console.log(`Listening on the port ${port}`);
});

module.exports = {app};