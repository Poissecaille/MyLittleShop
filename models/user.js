const Sequelize = require('sequelize');
const db = require("../settings/database");
const roles = ["buyer", "seller", "admin"];

const User = Sequelize.define('Users', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    email: {
        type: Sequelize.DataTypes.STRING, unique: true
    }
})
