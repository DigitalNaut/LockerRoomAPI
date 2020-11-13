'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      authToken: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      role: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      firstName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      DOB: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      picture: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  },
};
