const { DataTypes } = require("sequelize");

const UserModel = (sequelize) => sequelize.define("Message", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sender_id: DataTypes.INTEGER,
  recipient_id: DataTypes.INTEGER,
  date: DataTypes.DATE,
  message_header: DataTypes.STRING,
  message_body: DataTypes.STRING,
  message_footer: DataTypes.STRING,
});

module.exports = UserModel;