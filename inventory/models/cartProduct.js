var db = require("../settings/database");
const { DataTypes } = require('sequelize');
process.env.NODE_ENV == "dev" ? db = db.sequelizeDev : db = db.sequelizeTest

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
    },
    ownerId: {
        type: DataTypes.INTEGER, allowNull: false, unique: true
    }
}, {
    freezeTableName: true,
    tableName: "cartProduct"
});

module.exports = cartProduct;