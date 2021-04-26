module.exports = (sequelize, Sequelize) => {
  const Notify = sequelize.define("notify", {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING(6),
      allowNull: false,
    },
  });

  return Notify;
};
