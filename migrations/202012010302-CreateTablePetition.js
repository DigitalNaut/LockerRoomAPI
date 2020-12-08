"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Petitions", {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      sender: {
        allowNull: false,
        type: Sequelize.STRING,
        references: {
          model: "Users",
          key: "username",
        },
        onDelete: "CASCADE",
      },
      event: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Events",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      enclosure: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      result: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      resultMessage: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Petitions");
  },
};
