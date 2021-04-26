const db = require("../models");
const Lease = db.lease;
const Data_room = db.data_room;
const User = db.user;

exports.findAll = (req, res) => {
  Lease.findAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAllSuccess = (req, res) => {
  Lease.findAll({ where: { lease_status: "บันทึกสัญญาเรียบร้อยแล้ว" } })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// เอาให้ส่งข้อมูลเผื่อใช้เปิดดูรูป
exports.findByRid = (req, res) => {
  Lease.findAll({ where: { room_number: req.params.rid } })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// สร้างสัญญาเช่า
exports.create = (req, res) => {
  console.log(req.body);
  Lease.create(req.body)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// แก้ไขสัญญาเช่า
exports.update = (req, res) => {
  Lease.update(req.body, {
    where: { id: req.params.id },
  })
    .then((afterUpdate) => {
      res.send({ message: "แก้ไขสัญญาเช่าสำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// ลบสัญญาเช่า
exports.delete = (req, res) => {
  const id = req.params.id;
  Lease.destroy({
    where: { id: id },
  })
    .then((deleteLease) => {
      res.send({ message: "ลบสัญญาเช่าสำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// ตรวจสอบมีไฟล์หรือไม่
exports.uploadImg = (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("ไม่มีไฟล์");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
};

// upload รูปที่ 1
exports.uploadLeaseFile1 = (req, res, next) => {
  Lease.update({ photo_1: req.body.filename }, { where: { id: req.params.id } })
    .then((updateLeaseImg) => {
      res.send({ message: "เพิ่มรูปภาพสำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.uploadLeaseFile2 = (req, res, next) => {
  Lease.update({ photo_2: req.body.filename }, { where: { id: req.params.id } })
    .then((updateLeaseImg) => {
      res.send({ message: "เพิ่มรูปภาพสำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// upload รูปที่ 3
exports.uploadLeaseFile3 = (req, res, next) => {
  Lease.update(
    {
      lease_status: "บันทึกสัญญาเรียบร้อยแล้ว",
      photo_3: req.body.filename,
    },
    { where: { id: req.params.id } }
  )
    .then((updateLeaseImg) => {
      Lease.findByPk(req.params.id).then((data) => {
        User.update(
          {
            lease_status: "บันทึกสัญญาเรียบร้อยแล้ว",
          },
          {
            where: { id: data.dataValues.user_id },
          }
        ).then((updateLeaseUser) => {
          res.send({ message: "เพิ่มรูปภาพสำเร็จ" });
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
