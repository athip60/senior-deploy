const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isGuest = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "guest") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Guest Role!",
      });
    });
  });
};

isOwner = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      if (roles[0].dataValues.name === "owner") {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Owner Role!",
      });
    });
  });
};

isOwnerOrGuest = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "owner") {
          next();
          return;
        }

        if (roles[i].name === "guest") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Owner or Admin Role!",
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isOwner: isOwner,
  isGuest: isGuest,
  isOwnerOrGuest: isOwnerOrGuest,
};
module.exports = authJwt;
