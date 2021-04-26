const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.room = require("../models/room.model.js")(sequelize, Sequelize);
db.data_room = require("../models/data_room.model.js")(sequelize, Sequelize);
db.bill = require("../models/bill.model.js")(sequelize, Sequelize);
db.lease = require("../models/lease.model.js")(sequelize, Sequelize);
db.income = require("../models/income.model.js")(sequelize, Sequelize);
db.blog = require("../models/blog.model.js")(sequelize, Sequelize);
db.comment = require("../models/comment.model.js")(sequelize, Sequelize);
db.notify = require("../models/notify.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

db.ROLES = ["user", "owner", "guest"];

module.exports = db;
