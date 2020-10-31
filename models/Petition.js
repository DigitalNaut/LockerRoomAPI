const { DataTypes } = require("sequelize");

const PetitionModel = (sequelize) =>
  sequelize.define("Petition", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    code: DataTypes.INTEGER,
    enclosure: DataTypes.STRING,
    result: DataTypes.STRING,
    resultMessage: DataTypes.STRING,
  });

module.exports = PetitionModel;

// Type: Type of petition? Ride home, claim locker, event
// Code: Event identifier
// Enclosure: Data for the petition.
//    Ride home - Destination
//    Claim locker - Locker ID
//    Giveaway - Guess answer
