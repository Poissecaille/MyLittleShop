const db = require("../settings/database");
const { DataTypes } = require('sequelize');

const OrderProduct = db.define('orderProduct', {
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
    shipped: {
        type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false
    },
    shipping_date: {
        type: DataTypes.DATE, allowNull: true
    }
}, {
    freezeTableName: true,
    tableName: "orderProduct"
});

module.exports = OrderProduct;