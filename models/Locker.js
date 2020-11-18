"use strict";

const purger = require("../controllers/purger");
const { filters } = require("../config/filters");

const LockerModule = (sequelize, DataTypes) => {
  let locker = sequelize.define("Locker", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAt: { type: DataTypes.DATE,  },
    updatedAt: { type: DataTypes.DATE,  },
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

  locker.prototype.purge = function (role, personal = false) {
    purger.purge(
      this.dataValues,
      (personal ? filters.locker[role] : filters.locker.public) ||
        filters.locker.public
    );
  };

  return locker;
};

module.exports = LockerModule;
