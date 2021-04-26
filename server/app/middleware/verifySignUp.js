const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        message: "มีชื่อผู้ใช้งานนี้อยู่ในระบบแล้วกรุณาลองใหม่อีกครั้ง",
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user) {
        res.status(400).send({
          message: "มีอีเมลล์ผู้ใช้งานนี้อยู่ในระบบแล้วกรุณาลองใหม่อีกครั้ง",
        });
        return;
      }

      next();
    });
  });
};

checkPassword = (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    res.status(400).send({
      message: "กรุณากรอกรหัสผ่านให้ตรงกัน",
    });
    return;
  }
  next();
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i],
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
  checkPassword: checkPassword,
};

module.exports = verifySignUp;
