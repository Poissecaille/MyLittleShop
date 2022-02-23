require('dotenv').config();
module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT
  },
  "test": {
    "username": process.env.DBTEST_USERNAME,
    "password": process.env.DBTEST_PASSWORD,
    "database": process.env.DBTEST_NAME,
    "host": process.env.HOST,
    "dialect": process.env.DIALECT
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}