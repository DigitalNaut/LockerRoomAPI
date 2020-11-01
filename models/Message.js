'use strict';

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
    sender_id: DataTypes.INTEGER,
    recipient_id: DataTypes.INTEGER,
    message_header: DataTypes.STRING,
    message_body: DataTypes.STRING,
    message_footer: { type: DataTypes.STRING, allowNull: true },
  });

  message.associate = (models) => {
    message.belongsTo(models.User, {});
  };

  return message;
};

module.exports = MessageModel;