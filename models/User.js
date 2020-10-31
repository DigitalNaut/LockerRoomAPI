const { DataTypes } = require("sequelize");

const UserModel = (sequelize) => sequelize.define("Users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  firstname: DataTypes.STRING,
  lastname: DataTypes.STRING,
  DOB: DataTypes.DATEONLY,
  hireDate: DataTypes.DATEONLY,
  address: DataTypes.STRING,
  phone: DataTypes.NUMBER,
  picture: DataTypes.STRING,
});

module.exports = UserModel;