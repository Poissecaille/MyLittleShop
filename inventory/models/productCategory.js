var db = require("../settings/database");
const { DataTypes } = require('sequelize');
process.env.NODE_ENV === "development" ? db = db.sequelizeDev : db = db.sequelizeTest

const ProductCategory = db.define('productCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: {
        type: DataTypes.INTEGER, unique: "compositePK", allowNull: false
    },
    name: {
        type: DataTypes.STRING, unique: "compositePK", allowNull: false
    }, 
},
    {
        freezeTableName: true,
        tableName: "productCategory",
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);
module.exports = ProductCategory;