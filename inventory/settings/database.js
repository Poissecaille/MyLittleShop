const { Sequelize } = require('sequelize');

var sequelizeDev = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.INVENTORY_DB_HOST,
    port: process.env.INVENTORY_DB_PORT,
    dialect: process.env.DIALECT,
});

var sequelizeTest = new Sequelize({
    database: process.env.DBTEST_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.INVENTORY_DB_TEST_HOST,
    port: process.env.INVENTORY_DB_TEST_PORT,
    dialect: process.env.DIALECT,
    logging:false
});
module.exports = { sequelizeDev, sequelizeTest };