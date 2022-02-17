module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define(
    'Post',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      createdAt: DataTypes.DATE
    },
    {
      timestamps: false,
      tableName: 'posts',
    }
  );

  return post;
};