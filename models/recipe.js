let mongoose = require('mongoose');

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
  }
});

let Recipe = module.exports = mongoose.model('Recipe', recipeSchema);
