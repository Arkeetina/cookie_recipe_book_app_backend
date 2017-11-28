let {Admin} = require('./../models/admin');

let authenticate = (req, res, next) => {
let token = req.header('x-auth');

  Admin.findByToken(token).then((admin) => {
    if (!admin) {
      return Promise.reject();
    }

    req.admin = admin;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send({error: "Not authorized"});
  });
};

module.exports = {authenticate};