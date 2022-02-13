const db = require("../settings/database");
const { DataTypes } = require('sequelize');
const condition = ["new", "occasion", "renovated"];

const Product = db.define('product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50), allowNull: false, unique: true
    },
    label: {
        type: DataTypes.STRING(50), allowNull: false
    },
    condition: {
        type: DataTypes.ENUM(condition), allowNull: false, defaultValue: condition[0]
    },
    description: {
        type: DataTypes.TEXT, allowNull: false
    },
    unitPrice: {
        type: DataTypes.FLOAT, allowNull: false
    },
    availableQuantity: {
        type: DataTypes.INTEGER, allowNull: false
    },
    ownerId: {
        type: DataTypes.INTEGER, allowNull: false
    }
    // product_category_id: {
    //     type: DataTypes.INTEGER,
    // references: {
    //     model: "ProductCategory",
    //     key: "id"
    // }
    // },
    // product_tag_id: {
    //     type: DataTypes.INTEGER,
    // references: {
    //     model: "ProductTag",
    //     key: "id"
    // }
    // }
},
    {
        freezeTableName: true,
        tableName: "product"
    });

module.exports = Product;