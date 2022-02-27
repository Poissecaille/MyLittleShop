var db = require("../settings/database");
const { DataTypes } = require('sequelize');
process.env.NODE_ENV == "dev" ? db = db.sequelizeDev : db = db.sequelizeTest

const ProductCategory = db.define('productCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING, unique: false
    }, //freezeTableName: true
},
    {
        freezeTableName: true,
        tableName: "productCategory",
        timestamps: false
    }
);
module.exports = ProductCategory;