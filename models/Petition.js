"use strict";

const PetitionModel = (sequelize, DataTypes) => {
  let petition = sequelize.define("Petition", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
    userId: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
    code: { type: DataTypes.INTEGER },
    enclosure: { type: DataTypes.STRING },
    result: { type: DataTypes.STRING, defaultValue: "pending" },
    resultMessage: { type: DataTypes.STRING, allowNull: true },
  });

  petition.associate = function (models) {
    petition.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      allowNull: false,
    });
  };

  return petition;
};

module.exports = PetitionModel;
