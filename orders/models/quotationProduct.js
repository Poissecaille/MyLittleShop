var db = require("../settings/database");
const { DataTypes } = require('sequelize');
process.env.NODE_ENV == "dev" ? db = db.sequelizeDev : db = db.sequelizeTest

const QuotationProduct = db.define("quotationProduct", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ownerId: {
        type: DataTypes.INTEGER, allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER, allowNull: false
    },
    value: {
        type: DataTypes.SMALLINT, allowNull: false
    },
    comment: {
        type: DataTypes.TEXT, allowNull: true
    }
},
    {
    freezeTableName: true,
    tableName: "quotationProduct"
    });

module.exports = QuotationProduct;