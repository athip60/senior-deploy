module.exports = (sequelize, Sequelize) => {
  const Room = sequelize.define("rooms", {
    room_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    room_status: {
      type: Sequelize.STRING(16),
      allowNull: false,
    },
    data_room: {
      type: Sequelize.INTEGER,
    },
    note: {
      type: Sequelize.TEXT,
    },
  });

  return Room;
};
