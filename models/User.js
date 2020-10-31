const { DataTypes } = require("sequelize");

const UserModel = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    DOB: DataTypes.DATEONLY,
    address: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    picture: DataTypes.STRING,
  });

  return User;
};

module.exports = UserModel;
