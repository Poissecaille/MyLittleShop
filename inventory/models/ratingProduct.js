var db = require("../settings/database");
const { DataTypes } = require('sequelize');
process.env.NODE_ENV === "development" ? db = db.sequelizeDev : db = db.sequelizeTest

const RatingProduct = db.define("ratingProduct", {
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
    tableName: "ratingProduct",
    createdAt: "created_at",
    updatedAt: "updated_at"
    });

module.exports =RatingProduct;