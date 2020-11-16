"use strict";

const purger = require("../controllers/purger");

const MessageModel = (sequelize, DataTypes) => {
  let message = sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    sender: DataTypes.STRING,
    recipient: DataTypes.STRING,
    subject: {type: DataTypes.STRING, defaultValue: "No subject"},
    body: {type: DataTypes.STRING, defaultValue: "No message body"},
    footer: { type: DataTypes.STRING, allowNull: true },
  });

  message.associate = function (models) {
    message.belongsTo(models.User, {
      foreignKey: "sender",
      allowNull: false,
    });
    message.belongsTo(models.User, {
      foreignKey: "recipient",
      allowNull: false,
    });
  };

  message.prototype.purge = purger.purge;

  return message;
};

module.exports = MessageModel;
