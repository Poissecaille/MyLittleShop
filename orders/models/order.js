const db = require("../settings/database");
const { DataTypes } = require('sequelize');

const Order = db.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ownerId: {
        type: DataTypes.INTEGER, allowNull: false, unique: "compositePK"
    },
    productId: {
        type: DataTypes.INTEGER, allowNull: false, unique: "compositePK"
    },
    quantity: {
        type: DataTypes.INTEGER, allowNull: false
    },
    value: {
        type: DataTypes.INTEGER, allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "order"
});

module.exports = Order;