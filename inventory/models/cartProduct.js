const db = require("../settings/database");
const { DataTypes } = require('sequelize');

const cartProduct = db.define('cartProduct', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER, allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER, allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "cartProduct"
});

module.exports = cartProduct;