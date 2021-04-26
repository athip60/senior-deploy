const { sequelize, Sequelize } = require("../models");
const db = require("../models");
const Income = db.income;
exports.create = (req, res) => {
  Income.create(req.body)
    .then((createIncome) => {
      res.send({ message: "สร้างใบแจ้งชำระเงินสำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAll = (req, res) => {
  Income.findAll({ order: [["date_program", "DESC"]] })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAllSum = (req, res) => {
  Income.findAll({
    attributes: [
      "debit",
      [Sequelize.fn("SUM", Sequelize.col("debit")), "debit"],
      "credit",
      [Sequelize.fn("SUM", Sequelize.col("credit")), "credit"],
      "balance",
      "date_program",
    ],
    group: ["date_program"],
    order: [["date_program", "ASC"]],
  })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.update = (req, res) => {
  Income.update(req.body, {
    where: { id: req.params.id },
  })
    .then((afterUpdate) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ status: true });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Income.destroy({
    where: { id: id },
  })
    .then((deleteIncome) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ status: false });
    });
};
