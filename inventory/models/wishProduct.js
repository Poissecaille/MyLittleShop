var db = require("../settings/database");
const { DataTypes } = require('sequelize');
process.env.NODE_ENV === "development" ? db = db.sequelizeDev : db = db.sequelizeTest

const wishProduct = db.define('wishProduct', {
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
},
    {
        freezeTableName: true,
        tableName: "wishProduct",
        createdAt: "created_at",
        updatedAt: "updated_at"    
    });
    module.exports = wishProduct;