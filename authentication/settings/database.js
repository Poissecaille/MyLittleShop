const { Sequelize } = require('sequelize');

var sequelizeDev = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DIALECT,
});

var sequelizeTest = new Sequelize({
    database: process.env.DBTEST_NAME,
    username: process.env.DBTEST_USERNAME,
    password: process.env.DBTEST_PASSWORD,
    host: process.env.HOST,
    port: process.env.DBTEST_PORT,
    dialect: process.env.DIALECT,
});
module.exports = { sequelizeDev, sequelizeTest };