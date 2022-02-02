const db = require("../settings/database");
const { DataTypes } = require('sequelize')
const roles = ["buyer", "seller", "admin"];

const User = db.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING, unique: true
    },
    firstName: {
        type: DataTypes.STRING(50)
    },
    lastName: {
        type: DataTypes.STRING(50)
    },
    password: {
        type: DataTypes.STRING
    },
    birthDate: {
        type: DataTypes.DATEONLY
    },
    firstName: {
        type: DataTypes.STRING(50)
    },
    role: {
        type: DataTypes.ENUM(roles)
    },
    createdAt: {
        type: DataTypes.DATE
    },
    modifiedAt: {
        type: DataTypes.DATE
    }
})
