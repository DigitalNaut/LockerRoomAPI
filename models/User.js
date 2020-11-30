"use strict";

const bcrypt = require("bcrypt");
const purger = require("../controllers/purger");
const { filters } = require("../config/filters");

const UserModel = (sequelize, DataTypes) => {
  let user = sequelize.define(
    "User",
    {
      username: {
        primaryKey: true,
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      createdAt: { type: DataTypes.DATE },
      updatedAt: { type: DataTypes.DATE },
      role: { type: DataTypes.STRING, defaultValue: "user" },
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
    },

    {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
    }
  );

  user.associate = function (models) {
    user.hasMany(models.Locker, { foreignKey: "user", as: "lockers" });
    user.hasMany(models.Message, { foreignKey: "sender", as: "messages" });
    user.hasMany(models.Petition, { foreignKey: "sender", as: "petitions" });
    user.hasMany(models.Event, { foreignKey: "creator", as: "events" });
  };

  user.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  user.prototype.purge = function (role, personal = false) {
    return purger.purge(
      this.dataValues,
      (personal ? filters.user[role] : filters.user.public) ||
        filters.user.public
    );
  };

  return user;
};

module.exports = UserModel;
