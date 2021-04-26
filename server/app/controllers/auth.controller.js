const db = require("../models");
const config = require("../config/auth.config");
const mysql = require("mysql2");
const User = db.user;
const Role = db.role;
const Room = db.room;
const Data_room = db.data_room;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const db1 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "schlaf",
});
// สมัครสมาชิก
exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
    tel: req.body.tel,
    role_user: "user",
    role: ["user"],
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          // เพิ่มข้อมูลไปยัง table role
          user.setRoles(roles).then(() => {
            res.send({ message: "สมัครสมาชิกสำเร็จ" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "สมัครสมาชิกสำเร็จ" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// เข้าสู่ระบบ
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "ไม่มีผู้ใช้งานในระบบหรือรหัสผ่านไม่ถูกต้อง" });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "ไม่มีผู้ใช้งานในระบบหรือรหัสผ่านไม่ถูกต้อง",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          name: user.name,
          surname: user.surname,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// ค้นหาผู้ใช้ในระบบทั้งหมดยกเว้นคนที่ login อยู่
exports.findAllWithOutLogin = (req, res) => {
  User.findAll({
    where: {
      id: {
        [Op.not]: req.userId,
      },
    },
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// ค้นหาผู้ใช้ในระบบทั้งหมดยกเว้นคนที่ login อยู่ เรียงตามคนที่สมัครล่าสุด
exports.findAllOrderByLast = (req, res) => {
  User.findAll({
    where: {
      id: {
        [Op.not]: req.userId,
      },
    },
    order: [["id", "DESC"]],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAllGuest = (req, res) => {
  User.findAll({
    where: {
      // ค้นหาข้อมูลที่มีสถานะเป็นผู้เข้าพัก
      role_user: "guest",
    },
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// ค้นหาข้อมูลผู้ใช้เพิ่มน้ำข้อมูลไปใส่ในหน้าผังห้อง
exports.findAllGuestForInsert = (req, res) => {
  User.findAll({
    where: {
      // ค้นหาข้อมูลที่มีสถานะเป็นผู้เข้าพัก และยังไม่มีห้องพักหรือที่พักอยู่ในน้องนั้นๆ
      [Op.and]: [
        { role_user: "guest" },
        { [Op.or]: [{ room_number: null }, { room_number: req.params.id }] },
      ],
    },
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// update ผู้ใช้งานตาม id ที่ส่งมา
exports.update = (req, res) => {
  const id = req.params.id;
  // User.findByPk(id).then((beforeData) => {
  User.update(req.body, {
    where: { id: id },
  })
    .then((user) => {
      if (req.body.role_user) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: [req.body.role_user],
            },
          },
        }).then((roles) => {
          db1.query(
            "UPDATE user_roles SET roleId = ? WHERE userId = ?",
            [roles[0].dataValues.id, id],
            (error, results) => {
              if (error) {
                res.send({ message: error });
              } else {
                res.send({
                  message: "แก้ไขสำเร็จ",
                });
              }
            }
          );
        });
      } else {
        res.send({
          message: "แก้ไขสำเร็จ",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
  // });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id },
  })
    .then((count) => {
      console.log(count);
      if (count == 1) {
        Data_room.findAll({ where: { user: id } })
          .then((dataRoom) => {
            if (dataRoom.length) {
              Data_room.destroy({
                where: { user: id },
              }).then((afterDelete) => {
                Room.update(
                  { status: "0" },
                  { where: { id: dataRoom[0].dataValues.rtid } }
                ).then((data) => {
                  res.send({
                    message: "ลบผู้ใช้สำเร็จ",
                  });
                });
              });
            } else {
              res.send({
                message: "ลบผู้ใช้สำเร็จ",
              });
            }
          })
          .catch((err) => {
            res.send({
              message: "ลบผู้ใช้สำเร็จ",
            });
          });
      } else {
        res.send({
          message: "ไม่สามารถลบได้ ไม่มีข้อมูลในระบบ",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findById = (req, res) => {
  User.findByPk(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
