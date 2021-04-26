const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // สมัครสถาชิก
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
      verifySignUp.checkPassword,
    ],
    controller.signup
  );

  app.get(
    "/api/auth/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.findById
  );

  // ล็อคอิน
  app.post("/api/auth/signin", controller.signin);

  // หาข้อมูลผู้ใช้ในระบบทั้งหมด แต่จะไม่แสดงข้อมูลของคนที่ login
  app.get(
    "/api/auth",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAll
  );
  app.get(
    "/api/auth/getAll/withoutlogin",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAllWithOutLogin
  );

  app.get(
    "/api/auth/getAll/order",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAllOrderByLast
  );

  // app.get(
  //   "/api/auth/ads",
  //   [authJwt.verifyToken, authJwt.isOwner],
  //   controller.findAllLogin
  // );

  // เลือกผู้ใช้ที่มีสถานะเป็นผู้เข้าพักและมีข้อมูลอยู่ในห้องนั้นๆ
  // api นะจะเป็นของ insert dialog
  app.get(
    "/api/auth/guests/all",
    controller.findAllGuest
  );

  app.get(
    "/api/auth/guest/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAllGuestForInsert
  );

  // แก้ไขข้อมูลใช้ หากผู้ใช้มีสถานะเป็นผู้เข้าพักและทำการเปลี่ยนสถานะเป็นสถานะอื่น
  // จะทำการลบข้อมูลในหอพักนั้นๆออกด้วย
  app.put(
    "/api/auth/update/:id",
    [authJwt.verifyToken, authJwt.isOwnerOrGuest],
    controller.update
  );

  // ลบข้อมูลใช้ หากผู้ใช้อยู่ในห้องพักจะทำการลบข้อมูลออกจากห้องพักนั้นด้วย
  app.delete(
    "/api/auth/delete/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.delete
  );
};
