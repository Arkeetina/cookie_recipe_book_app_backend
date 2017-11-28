const mongoose = require('mongoose');
const shortid = require('shortid');

// Recipe Schema
let recipeSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type: String,
    required: true
  },
  fileUpload: {
    type: String,
    required: true
  }
});

let Recipe = module.exports = mongoose.model('Recipe', recipeSchema);
