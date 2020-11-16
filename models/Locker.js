"use strict";

const purger = require("../controllers/purger");

const LockerModule = (sequelize, DataTypes) => {
  let locker = sequelize.define("Locker", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user: { type: DataTypes.STRING, allowNull: true },
    alias: { type: DataTypes.STRING, allowNull: true },
    location: { type: DataTypes.STRING, allowNull: true },
  });

  locker.associate = function (models) {
    locker.belongsTo(models.User, {
      foreignKey: "user",
      allowNull: false,
    });
  };

  locker.prototype.purge = purger.purge;

  return locker;
};

module.exports = LockerModule;
