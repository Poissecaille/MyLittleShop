const db = require("../settings/database");
const { DataTypes } = require('sequelize');

const ProductTag = db.define('productTag', {
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
        freezeTableName: true,
        tableName: "productTag",
        timestamps: false
    }
);

module.exports = ProductTag;