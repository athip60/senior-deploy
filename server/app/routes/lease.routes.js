const { authJwt } = require("../middleware");
const controller = require("../controllers/lease.controller");
const multer = require("multer");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/lease/",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAll
  );

  app.get(
    "/api/lease/success",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAllSuccess
  );

  app.get(
    "/api/lease/:rid",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findByRid
  );

  app.post(
    "/api/lease/create",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.create
  );

  app.put(
    "/api/lease/update/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.update
  );

  app.delete(
    "/api/lease/delete/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.delete
  );

  const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, "src/assets/uploads/lease");
    },
    filename: (req, file, callBack) => {
      callBack(null, `Lease_${req.params.id}.jpg`);
    },
  });

  const upload = multer({ storage: storage });

  app.post("/api/lease/img1/:id", upload.single("file"), controller.uploadImg);
  app.post("/api/lease/img2/:id", upload.single("file"), controller.uploadImg);
  app.post("/api/lease/img3/:id", upload.single("file"), controller.uploadImg);

  app.put(
    "/api/lease/upload/img1/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.uploadLeaseFile1
  );

  app.put(
    "/api/lease/upload/img2/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.uploadLeaseFile2
  );

  app.put(
    "/api/lease/upload/img3/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.uploadLeaseFile3
  );
};
