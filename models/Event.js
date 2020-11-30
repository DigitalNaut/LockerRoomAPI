"use strict";

const purger = require("../controllers/purger");
const { filters } = require("../config/filters");
const JsonField = require("sequelize-json");

const EventModel = (sequelize, DataTypes) => {
  let event = sequelize.define("Event", {
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    creator: DataTypes.STRING,
    title: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    about: {
      type: JsonField(sequelize, "Event", "about"),
      defaultValue: {},
    },
    expDate: { type: DataTypes.DATE, allowNull: true },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userFilter: {
      type: JsonField(sequelize, "Event", "userFilter"),
      defaultValue: {},
    },
    mandatory: { type: DataTypes.BOOLEAN, defaultValue: 0 },
    expDate: DataTypes.DATE,
    template: {
      type: JsonField(sequelize, "Event", "template"),
      defaultValue: {},
    },
  });

  event.associate = function (models) {
    event.belongsTo(models.User, {
      foreignKey: "creator",
      allowNull: false,
    });
  };

  event.prototype.purge = function (role, personal = false) {
    return purger.purge(
      this.dataValues,
      (personal ? filters.message[role] : filters.message.public) ||
        filters.message.public
    );
  };

  return event;
};

module.exports = EventModel;
