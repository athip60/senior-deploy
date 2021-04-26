const db = require("../models");
const User = db.user;
const Room = db.room;
const Data_room = db.data_room;

// เพิ่มห้องพักใหม่
exports.create = (req, res) => {
  // หาดูว่ามีห้องที่จะทำการเพิ่มอยู่แล้วไหม
  Room.findAll({ where: { room_number: req.body.room_number } })
    .then((data) => {
      // ถ้ามีห้องที่จะทำการเพิ่มแล้ว
      if (data.length) {
        res.send({ message: `มีห้อง ${req.body.room_number} อยู่แล้ว` });
        // ถ้าไม่มี
      } else {
        Room.create(req.body)
          .then((data) => {
            res.send({ message: `เพิ่มห้อง ${req.body.room_number} สำเร็จ` });
          })
          .catch((err) => {
            res.status(500).send({ message: err.message });
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// หาห้องทั้งหมดที่ถูกสร้าง
exports.findAll = (req, res) => {
  Room.findAll({
    order: [["room_number", "ASC"]],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// update ข้อมูลหากมีการเปลี่ยนสถานะห้อง
exports.update = (req, res) => {
  Room.update(req.body, {
    where: { id: req.params.id },
  })
    .then((afterUpdate) => {
      res.send({ message: `แก้ไขข้อมูลห้อง ${req.body.room_number} สำเร็จ` });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

// ลบข้อมูลห้องใน table Data_room
exports.deleteDataRoom = (req, res) => {
  Data_room.destroy({
    where: { id: req.params.id },
  })
    .then((afterDeleteDataRoom) => {
      res.send({
        message: "ลบข้อมูลห้องสำเร็จ",
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

// ค้นข้อมูลของ user คนนั้นๆใน table Data_room
exports.findDataRoomByUID = (req, res) => {
  Data_room.findAll({ where: { user_id: req.params.uid } }).then((data) => {
    if (data.length) {
      res.json(data);
    } else {
      res.json(data);
    }
  });
};

exports.findDataRoomByID = (req, res) => {
  Data_room.findByPk(req.params.id).then((data) => {
    if (data.length) {
      res.json(data);
    } else {
      res.json(data);
    }
  });
};

// สร้างห้องพักและ ข้อมูลห้องพักใหม่
exports.create_data_room = (req, res) => {
  Data_room.create(req.body)
    .then((afterCreate) => {
      res.json(afterCreate);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

// เอาไว้ check ถ้าหากแก้ไขเลขห้องที่มีอยู่แล้ว
exports.checkRoomNumber = (req, res) => {
  Room.findAll({ where: { room_number: req.params.rid } })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

// แก้ไข Data room
exports.updateDataRoom = (req, res) => {
  Data_room.update(req.body, { where: { id: req.params.id } })
    .then((afterUpdate) => {
      res.send({ message: "แก้ไขข้อมูลห้องสำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

// หาข้อมูลผู้ใช้ในห้องนั้นๆ จากเลขของห้อง
exports.findByRoom = (req, res) => {
  const rid = req.params.id;
  User.findOne({ where: { room_number: rid } })
    .then((data) => {
      if (!data) {
        // ส่งค่า null
        res.json(data);
      } else {
        // ส่งข้อมูลผู้ใช้ของห้องนั้นๆ
        res.json(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "ไม่มีข้อมูลผู้เข้าพักห้อง " + rid });
    });
};

exports.findById = (req, res) => {
  Room.findByPk(req.params.id)
    .then((data) => {
      if (!data) {
        // ส่งค่า null
        res.json(data);
      } else {
        // ส่งข้อมูลผู้ใช้ของห้องนั้นๆ
        res.json(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "ไม่มีข้อมูลผู้เข้าพักห้อง " + rid });
    });
};

exports.delete_room = (req, res) => {
  const id = req.params.id;
  Room.destroy({
    where: { id: id },
  })
    .then((data) => {
      res.send({ message: "ลบห้องพักสำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
