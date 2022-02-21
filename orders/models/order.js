const db = require("../settings/database");
const { DataTypes } = require('sequelize');

const Order = db.define('order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ownerId: {
        type: DataTypes.INTEGER, allowNull: false
    },
    userAddress: {
        type: DataTypes.STRING, allowNull: false
    },
    value: {
        type: DataTypes.FLOAT, allowNull: true
    }
}, {
    freezeTableName: true,
    tableName: "order"
}
);

module.exports = Order;