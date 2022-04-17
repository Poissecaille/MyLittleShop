var db = require("../settings/database");
const { DataTypes } = require('sequelize');
process.env.NODE_ENV === "development" ? db = db.sequelizeDev : db = db.sequelizeTest

const cartProduct = db.define('cartProduct', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER, allowNull: false, unique: 'compositePk'
    },
    ownerId: {
        type: DataTypes.INTEGER, allowNull: false, unique: 'compositePk'
    },
    quantity: {
        type: DataTypes.INTEGER, allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "cartProduct",
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = cartProduct;