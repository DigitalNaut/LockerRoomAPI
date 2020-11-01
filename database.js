const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("lockerroom_api", "root", "root", {
  host: 'localhost',
  dialect: 'mariadb',
  logging: false
});

module.exports = sequelize;