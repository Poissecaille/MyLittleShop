const db = require("../settings/database");
const { DataTypes } = require('sequelize');


const ProductCategory = db.define('productCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    }, //freezeTableName: true
},
    {
        freezeTableName:true,
        tableName: "productCategory",
        timestamps:false
    }
);
module.exports = ProductCategory;