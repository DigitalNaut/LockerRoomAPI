const { DataTypes } = require("sequelize");

const LockerModel = (sequelize) =>
  sequelize.define("Locker", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: DataTypes.INTEGER,
    alias: DataTypes.STRING,
    location: DataTypes.STRING,
  });

module.exports = LockerModel;
