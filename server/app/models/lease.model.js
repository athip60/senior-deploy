module.exports = (sequelize, Sequelize) => {
  const Lease = sequelize.define("lease", {
    // table user = id
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    // table rooms = id
    room_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    lease_status: {
      type: Sequelize.STRING(28),
      allowNull: false,
    },
    photo_1: {
      type: Sequelize.STRING,
    },
    photo_2: {
      type: Sequelize.STRING,
    },
    photo_3: {
      type: Sequelize.STRING,
    },
  });

  return Lease;
};
