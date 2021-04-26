module.exports = (sequelize, Sequelize) => {
  const DataRoom = sequelize.define("data-rooms", {
    // table rooms
    room_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    // table user
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    // table lease
    lease_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return DataRoom;
};
