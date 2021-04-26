const { authJwt } = require("../middleware");
const controller = require("../controllers/room.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // สร้างห้องใหม่
  app.post(
    "/api/room/create",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.create
  );

  // ใช้เมื่อมีการเปลี่ยนแปลงสถานะห้อง
  app.put(
    "/api/room/update/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.update
  );

  

  //------------------------- ทำใหม่ ----------------------------

  // table rooms

  // หาห้องทั้งหมดที่ถูกสร้าง
  app.get(
    "/api/room/",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findAll
  );

  // หาข้อมูลผู้ใช้ในห้องนั้นๆ จากเลขของห้อง
  app.get(
    "/api/room/getbyroom/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findByRoom
  );

  // ดึงข้อมูลห้องออกมาโดยใช้ id PK
  app.get(
    "/api/room/getbyid/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findById
  );

  // ลบห้องโดยใช้ id PK
  app.delete(
    "/api/room/delete/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.delete_room
  );

  // table data_rooms

  // สร้างข้อมูลของห้องนั้นๆ
  app.post(
    "/api/data_room/create",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.create_data_room
  );

  app.get(
    "/api/data_room/find-data-room-by-uid/:uid",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findDataRoomByUID
  );

  app.get(
    "/api/data_room/find-data-room-by-id/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.findDataRoomByID
  );

  // ใช้เพื่อตรวจสอบว่าถ้าจะสร้างห้องใหม่เลขห้องที่กำหนดซ้ำหรือไม่
  app.get(
    "/api/data_room/check-room-number/:rid",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.checkRoomNumber
  );

  // อัพเดทข้อมูลของห้องนั้น
  app.put(
    "/api/data_room/update/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.updateDataRoom
  );

  // ลบข้อมูลห้องนั้นๆโดยใช้ id PK
  app.delete(
    "/api/data_room/delete/:id",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.deleteDataRoom
  );
};
