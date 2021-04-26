module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    user_comment: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    post_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });
  return Comment;
};
