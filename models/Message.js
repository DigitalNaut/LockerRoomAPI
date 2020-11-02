"use strict";

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
    senderId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    subject: {type: DataTypes.STRING, defaultValue: "No subject"},
    body: {type: DataTypes.STRING, defaultValue: "No message body"},
    footer: { type: DataTypes.STRING, allowNull: true },
  });

  message.associate = function (models) {
    message.belongsTo(models.User, {
      foreignKey: "senderId",
      as: "sender",
      allowNull: false,
    });
    message.belongsTo(models.User, {
      foreignKey: "recipientId",
      as: "recipient",
      allowNull: false,
    });
  };

  return message;
};

module.exports = MessageModel;
