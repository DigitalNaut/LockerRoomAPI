"use strict";

const purger = require("../controllers/purger");
const { filters } = require("../config/filters");
const JsonField = require("sequelize-json");

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
    creator: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
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
    event.hasMany(models.Petition, { foreignKey: "event", as: "petitions" });
  };

  event.prototype.purge = function (role, roleFirstThenPublic = false) {
    return purger.purge(
      this.dataValues,
      (roleFirstThenPublic ? filters.event[role] : filters.event.public) ||
        filters.event.public
    );
  };

  return event;
};

module.exports = EventModel;
