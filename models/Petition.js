'use strict';

const PetitionModel = (sequelize, DataTypes) => {
  let petition = sequelize.define("Petition", {
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

  return petition;
};

module.exports = PetitionModel;
