"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Events", {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      creator: {
        allowNull: true,
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "username",
        },
        onDelete: "SET NULL",
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(100),
        primaryKey: true,
      },
      about: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING(32),
      },
      code: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      userFilter: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      mandatory: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      expDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      template: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Events");
  },
};
