module.exports = (sequelize, Sequelize) => {
  const Income = sequelize.define("incomes", {
    date_program: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    program: {
      type: Sequelize.STRING(150),
      allowNull: false,
    },
    debit: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    credit: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    balance: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    note: {
      type: Sequelize.STRING(150),
    },
  });

  return Income;
};
