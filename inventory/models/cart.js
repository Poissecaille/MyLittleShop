const db = require("../settings/database");
const { DataTypes } = require('sequelize');

const cart = db.define('cart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ownerId: {
        type: DataTypes.INTEGER, allowNull: false, unique: true
    }
}, {
    freezeTableName: true,
    tableName: "cart"
});

module.exports = cart;