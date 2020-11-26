"use strict";

const purger = require("../controllers/purger");
const { filters } = require("../config/filters");

const EventModel = (sequelize, DataTypes) => {
  let event = sequelize.define("Event", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    creator: DataTypes.STRING,
    userFilter: DataTypes.STRING,
    type: { type: DataTypes.STRING, allowNull: false },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  event.associate = function (models) {
    event.belongsTo(models.User, {
      foreignKey: "creator",
      allowNull: false,
    });
  };

  return event;
};

module.exports = EventModel;
