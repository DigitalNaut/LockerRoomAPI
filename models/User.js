"use strict";

const UserModel = (sequelize, DataTypes) => {
  let user = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    DOB: { type: DataTypes.DATEONLY },
    address: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    picture: { type: DataTypes.STRING },
  });

  user.associate = function(models) {
    user.hasMany(models.Message, {foreignKey: 'senderId', as: 'messages'})
    user.hasMany(models.Petition, {as: 'petitions'})
  };

  return user;
};

module.exports = UserModel;
