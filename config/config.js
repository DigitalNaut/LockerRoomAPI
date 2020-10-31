module.exports = {
  "development": {
    "username": process.env.MARIADB_USER,
    "password": process.env.MARIADB_PASSWORD,
    "database": "lockerroom-api",
    "host": "127.0.0.1",
    "dialect": "mariadb"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mariadb"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mariadb"
  }
}
