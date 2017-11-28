const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
 
// Recipe Schema
let AdminSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: (value)=>{
        return validator.isEmail(value);  
      },
      message:'{VALUE} is not a valid Email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

AdminSchema.methods.toJSON = function () {
  let admin = this;
  let adminObject = admin.toObject();

  return _.pick(adminObject, ['_id', 'email']);
};

AdminSchema.methods.generateAuthToken = function () {
  let admin = this;
  let access = 'auth';
  let token = jwt.sign({_id: admin._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  admin.tokens.push({access, token});

  return admin.save().then(() => {
    return token;
  });
};

AdminSchema.statics.findByToken = function (token) {
  let Admin = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return Promise.reject();
  }

  return Admin.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

AdminSchema.statics.findByCredentials = function(email, password) {
  let Admin = this;

  return Admin.findOne({email}).then((admin) => {
    if(!admin) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, admin.password, (err, res) => {
        if (res) {
          resolve(admin)
        } else {
          reject();
        }
      });
    });
  });
};

AdminSchema.pre('save', function (next) {
  let admin = this;

  if (admin.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(admin.password, salt, (err, hash) => {
        admin.password = hash;
        next();
      })
    })
  } else {
    next();
  }
});

AdminSchema.methods.removeToken = function(token) {
  let admin = this;

  return admin.update({
    $pull: {
      tokens: {token}
    }
  });
}

let Admin = mongoose.model('Admin', AdminSchema);

module.exports = {Admin}
