const { authJwt } = require("../middleware");
const controller = require("../controllers/blog.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //   api here

  app.get(
    "/api/blog",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAll
  );

  app.get(
    "/api/blog/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.findAllForGuest
  );

  // post api

  app.post(
    "/api/blog/create",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.create
  );
  
  app.put(
    "/api/blog/update-post/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.updatePost
  );

  app.delete(
    "/api/blog/delete-post/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.deletePost
  );

  // comment api

  app.post(
    "/api/blog/create-comment",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.createComment
  );

  app.put(
    "/api/blog/update-comment/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.updateComment
  );

  
  app.get(
    "/api/blog/comment/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.findComment
  );

  app.delete(
    "/api/blog/delete-comment/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.deleteComment
  );

  app.delete(
    "/api/blog/delete-comment-all/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.deleteCommentAll
  );
};
