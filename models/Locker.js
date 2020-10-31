const { DataTypes } = require("sequelize");

const UserModel = (sequelize) => sequelize.define("Locker", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  alias: DataTypes.STRING,
  location: DataTypes.STRING,
});

module.exports = UserModel;