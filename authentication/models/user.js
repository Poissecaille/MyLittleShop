const db = require("../settings/database");
const { DataTypes } = require('sequelize');
const roles = ["buyer", "seller", "admin"];

const User = db.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING, unique: true, allowNull: false
    },
    firstName: {
        type: DataTypes.STRING(50), allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50), allowNull: false
    },
    password: {
        type: DataTypes.STRING, allowNull: false
    },
    birthDate: {
        type: DataTypes.DATEONLY, allowNull: false
    },
    firstName: {
        type: DataTypes.STRING(50), allowNull: false
    },
    role: {
        type: DataTypes.ENUM(roles), allowNull: false, defaultValue: roles[0]
    },
    createdAt: {
        type: DataTypes.DATE, allowNull: false
    },
    modifiedAt: {
        type: DataTypes.DATE, allowNull: false
    },
});


module.exports = User;