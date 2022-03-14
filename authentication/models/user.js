var db = require("../settings/database");
const { DataTypes } = require('sequelize');
const roles = ["buyer", "seller", "admin"];
process.env.NODE_ENV === "development" ? db = db.sequelizeDev : db = db.sequelizeTest

const User = db.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING, unique: true, allowNull: false
    },
    username: {
        type: DataTypes.STRING(50), unique: true, allowNull: false
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
    role: {
        type: DataTypes.ENUM(roles), allowNull: false, defaultValue: roles[0]
    },
    activated: {
        type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true
    },
    createdAt: {
        type: DataTypes.DATE, allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE, allowNull: false
    },
}, {
    freezeTableName: true,
    tableName: "user"
});


module.exports = User;