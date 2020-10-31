const { DataTypes } = require("sequelize");

const UserModel = (sequelize) => sequelize.define("Petition", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  type: DataTypes.ENUM,
  code: DataTypes.INTEGER,
  enclosure: DataTypes.STRING,
  result: DataTypes.ENUM,
  resultMessage: DataTypes.STRING,
});

module.exports = UserModel;

// Type: Type of petition? Ride home, claim locker, event
// Code: Event identifier
// Enclosure: Data for the petition. 
//    Ride home - Destination
//    Claim locker - Locker ID
//    Giveaway - Guess answer