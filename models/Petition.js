"use strict";

const purger = require("../controllers/purger");

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
    sender: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    code: { type: DataTypes.INTEGER },
    enclosure: { type: DataTypes.STRING },
    result: { type: DataTypes.STRING, defaultValue: "pending" },
    resultMessage: { type: DataTypes.STRING, allowNull: true },
  });

  petition.associate = function (models) {
    petition.belongsTo(models.User, {
      foreignKey: "sender",
      allowNull: false,
    });
  };

  petition.prototype.purge = purger.purge;

  return petition;
};

module.exports = PetitionModel;
