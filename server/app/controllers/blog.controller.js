const db = require("../models");
const Blog = db.blog;
const Comment = db.comment;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
  Blog.findAll({ order: [["createdAt", "DESC"]] })
    .then((dataFindAll) => {
      res.json(dataFindAll);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findAllForGuest = (req, res) => {
  Blog.findAll({
    where: {
      [Op.or]: [{ send_from: req.params.id }, { send_from: null }],
    },
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

exports.create = (req, res) => {
  Blog.create(req.body)
    .then((createPost) => {
      res.send({ message: "โพสต์สำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updatePost = (req, res) => {
  Blog.update(req.body, {
    where: { id: req.params.id },
  })
    .then((updatePost) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ status: false });
    });
};

exports.deletePost = (req, res) => {
  Blog.destroy({
    where: { id: req.params.id },
  })
    .then((afterDelete) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

// comment function

exports.createComment = (req, res) => {
  Comment.create(req.body)
    .then((createPost) => {
      res.send({ message: "คอมเม้นต์สำเร็จ" });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.findComment = (req, res) => {
  Comment.findAll({
    where: { post_id: req.params.id },
    order: [["createdAt", "DESC"]],
  }).then((dataFindComment) => {
    res.json(dataFindComment);
  });
};

exports.updateComment = (req, res) => {
  Comment.update(req.body, {
    where: { id: req.params.id },
  })
    .then((updateComment) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ status: false });
    });
};

exports.deleteComment = (req, res) => {
  Comment.destroy({
    where: { id: req.params.id },
  })
    .then((afterDelete) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.deleteCommentAll = (req, res) => {
  Comment.destroy({
    where: { post_id: req.params.id },
  })
    .then((afterDelete) => {
      res.send({ status: true });
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};
