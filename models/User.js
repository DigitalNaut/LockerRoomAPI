const { DataTypes } = require("sequelize");

const UserModel = (sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: { type: DataTypes.DATE, default: Date.now() },
    updatedAt: { type: DataTypes.DATE, default: Date.now() },
    email: { type: DataTypes.STRING, default: "-" },
    password: { type: DataTypes.STRING, default: "-" },
    firstName: { type: DataTypes.STRING, default: "-" },
    lastName: { type: DataTypes.STRING, default: "-" },
    DOB: { type: DataTypes.DATEONLY, default: "-" },
    address: { type: DataTypes.STRING, default: "-" },
    phone: { type: DataTypes.STRING, default: "-" },
    picture: { type: DataTypes.STRING, default: "-" },
  });

  return user;
};

module.exports = UserModel;
