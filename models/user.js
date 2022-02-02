const db = require("../settings/database");
const {DataTypes} = require('sequelize')
const roles = ["buyer", "seller", "admin"];

const User = db.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    email: {
        type: DataTypes.STRING, unique: true
    }
})
