const { authJwt } = require("../middleware");
const controller = require("../controllers/notify.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/notify/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.findNoti
  );

  app.post(
    "/api/notify/",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.createNoti
  );

  app.put(
    "/api/notify/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.updateNoti
  );

};