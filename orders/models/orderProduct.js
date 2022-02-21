const db = require("../settings/database");
const { DataTypes } = require('sequelize');

const deliveryStatus = ["preparation", "shipped", 'delivred']

const OrderProduct = db.define('orderProduct', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER, allowNull: false
    }, quantity: {
        type: DataTypes.INTEGER, allowNull: false
    },
    shipped: {
        type: DataTypes.ENUM(deliveryStatus), allowNull: false, defaultValue: deliveryStatus[0]
    },
    shipping_date: {
        type: DataTypes.DATE, allowNull: true
    }
}, {
    freezeTableName: true,
    tableName: "orderProduct"
});

module.exports = OrderProduct;