const { authJwt } = require("../middleware");
const controller = require("../controllers/income.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //   api here
  app.post(
    "/api/income/create",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.create
  );

  app.get(
    "/api/income",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAll
  );

  app.get(
    "/api/income/sum",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAllSum
  );

  //   app.get(
  //     "/api/bill/findallbyDRID/:id",
  //     [authJwt.verifyToken, authJwt.isOwner],
  //     controller.findallbyDRID
  //   );

    app.put(
      "/api/income/update/:id",
      [authJwt.verifyToken, authJwt.isOwner],
      controller.update
    );

  app.delete(
    "/api/income/delete/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.delete
  );
};
