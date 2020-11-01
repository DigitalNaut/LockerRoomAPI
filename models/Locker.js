'use strict';

const LockerModule = (sequelize, DataTypes) => {
  let locker = sequelize.define("Locker", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: DataTypes.INTEGER,
    alias: DataTypes.STRING,
    location: DataTypes.STRING,
  });

  return locker;
};

module.exports = LockerModule;