module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(42),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    surname: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    tel: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    role_user: {
      // owner user guest
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    status_bill: {
      // room_number
      type: Sequelize.STRING(36),
    },
    room_number: {
      // room_number
      type: Sequelize.INTEGER,
    },
    lease_status: {
      //have & without
      type: Sequelize.STRING(28),
    },
  });

  return User;
};
