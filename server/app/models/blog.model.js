module.exports = (sequelize, Sequelize) => {
  const Blog = sequelize.define("blogs", {
    user_post: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    send_from: {
      type: Sequelize.INTEGER
    },
  });
  return Blog;
};
