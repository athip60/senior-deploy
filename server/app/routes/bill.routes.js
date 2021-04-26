const { authJwt } = require("../middleware");
const controller = require("../controllers/bill.controller");
const multer = require("multer");

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
    "/api/bill/create",
    // [authJwt.verifyToken, authJwt.isOwner],
    controller.create
  );

  app.get(
    "/api/bill",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAll
  );

  app.get(
    "/api/bill/findallbyDRID/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findallbyDRID
  );
  
  app.put(
    "/api/bill/update/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.update
  );

  app.delete(
    "/api/bill/delete/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.delete
  );

  app.get(
    "/api/bill-guest/:id",
    controller.findGuest
  );

  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, "src/assets/uploads/bills");
    },
    filename: (req, file, callBack) => {
      callBack(null, `Bill_${req.params.id}.jpg`);
    },
  });

  const upload = multer({ storage: storage });

  app.post("/api/bill/upload-payment/:id", upload.single("file"), controller.uploadImg);

  // app.put(
  //   "/api/bill/upload-payment/:id",
  //   [authJwt.verifyToken, authJwt.isGuest],
  //   controller.uploadBillFile
  // );
  app.put(
    "/api/bill/update-guest/:id",
    [authJwt.verifyToken, authJwt.isGuest],
    controller.update
  );
};
