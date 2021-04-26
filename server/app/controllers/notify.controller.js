const db = require("../models");
const Notify = db.notify;
const Op = db.Sequelize.Op;

exports.findNoti = (req, res) => {
  Notify.findAll({
    where: { user_id: req.params.id },
    order: [["createdAt", "DESC"]],
  })
    .then((dataFindAll) => {
      res.json(dataFindAll);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// post function

exports.createNoti = (req, res) => {
  Notify.create(req.body)
    .then((createNoti) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateNoti = (req, res) => {
  Notify.update(req.body, {
    where: { user_id: req.params.id },
  })
    .then((updateNoti) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ status: false });
    });
};
