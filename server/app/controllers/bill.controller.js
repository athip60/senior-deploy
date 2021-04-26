const db = require("../models");
const Bill = db.bill;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  Bill.create(req.body)
    .then((createBill) => {
      res.send({ message: "สร้างใบแจ้งชำระเงินสำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAll = (req, res) => {
  Bill.findAll({ order: [["createdAt", "DESC"]] }).then((dataFindAll) => {
    res.json(dataFindAll);
  });
};

exports.findallbyDRID = (req, res) => {
  Bill.findAll({
    where: {
      [Op.and]: [
        { data_room_id: req.params.id },
        { [Op.not]: [{ bill_status: "รอผู้เข้าพักอัพโหลดข้อมูลการชำระเงิน" }] },
      ],
    },
    order: [["id", "DESC"]],
  })
    .then((billData) => {
      res.json(billData);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// update ข้อมูลใบแจ้งชำระเงิน
exports.update = (req, res) => {
  Bill.update(req.body, {
    where: { id: req.params.id },
  })
    .then((afterUpdate) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

// delete ข้อมูลใบแจ้งชำระเงิน
exports.delete = (req, res) => {
  Bill.destroy({
    where: { id: req.params.id },
  })
    .then((afterDelete) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.findGuest = (req, res) => {
  Bill.findAll({
    where: {
      [Op.and]: [
        { user_in_room: req.params.id },
        { [Op.not]: [{ bill_status: "รอส่งให้ผู้เข้าพัก" }] },
      ],
    },
    order: [["id", "DESC"]],
  }).then((dataFindAll) => {
    res.json(dataFindAll);
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
