var dotenv = require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.MARIADB_USER,
    "password": process.env.MARIADB_PASSWORD,
    "database": process.env.MARIADB_DB_DEV,
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mariadb"
  },
  "test": {
    "username": process.env.MARIADB_USER,
    "password": process.env.MARIADB_PASSWORD,
    "database": process.env.MARIADB_DB_TEST,
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mariadb"
  },
  "production": {
    "username": process.env.MARIADB_USER,
    "password": process.env.MARIADB_PASSWORD,
    "database": process.env.MARIADB_DB,
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mariadb"
  }
}
