module.exports = {
  "development": {
    "username": process.env.MARIADB_USER,
    "password": process.env.MARIADB_PASSWORD,
    "database": "lockerroom_api",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mariadb"
  },
  "test": {
    "username": process.env.MARIADB_USER,
    "password": process.env.MARIADB_PASSWORD,
    "database": "lockerroom_api",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mariadb"
  },
  "production": {
    "username": process.env.MARIADB_USER,
    "password": process.env.MARIADB_PASSWORD,
    "database": "lockerroom_api",
    "host": "127.0.0.1",
    "port": "3306",
    "dialect": "mariadb"
  }
}
