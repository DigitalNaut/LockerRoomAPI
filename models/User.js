"use strict";

const bcrypt = require("bcrypt");

const UserModel = (sequelize, DataTypes) => {
  let user = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      username: { type: DataTypes.STRING },
      role: { type: DataTypes.STRING, defaultValue: "user"},
      authToken: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: DataTypes.defaultValue,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: DataTypes.defaultValue,
      },
      DOB: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.defaultValue,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: DataTypes.defaultValue,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: DataTypes.defaultValue,
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: DataTypes.defaultValue,
      },
    }, {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
    }
  );

  user.associate = function (models) {
    user.hasMany(models.Message, { foreignKey: "senderId", as: "messages" });
    user.hasMany(models.Petition, { as: "petitions" });
  };

  user.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return user;
};

module.exports = UserModel;
