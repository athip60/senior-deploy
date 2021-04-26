module.exports = (sequelize, Sequelize) => {
  const Bill = sequelize.define("bills", {
    user_issur_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_in_room: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    fullname_user_in_room: {
      type: Sequelize.STRING(102),
      allowNull: false,
    },
    data_room_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    room_number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    bill_status: {
      type: Sequelize.STRING(36),
      allowNull: false,
    },
    payment_status: {
      type: Sequelize.STRING(17),
    },
    room_cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    furniture_cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    internet_cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    water_cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    electric_cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    unit_in_month: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    unit_per_month: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    total_unit: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    total_cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    img_payment: {
      type: Sequelize.STRING,
    },
  });

  return Bill;
};
