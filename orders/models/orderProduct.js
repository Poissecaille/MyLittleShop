var db = require("../settings/database");
const { DataTypes } = require('sequelize');
process.env.NODE_ENV === "development" ? db = db.sequelizeDev : db = db.sequelizeTest

const defaultNumberOfDaysToDeliver = 3; 
const nextDate = new Date( Date.now() + defaultNumberOfDaysToDeliver * 24 * 60 * 60 * 1000)
const deliveryStatus = ["preparation", "shipped", 'delivred']

const OrderProduct = db.define('orderProduct', {
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
    addressId: {
        type: DataTypes.INTEGER, allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER, allowNull: false
    },
    shipped: {
        type: DataTypes.ENUM(deliveryStatus), allowNull: false, defaultValue: deliveryStatus[0]
    },
    shippingDate: {
        type: DataTypes.DATE, allowNull: true, defaultValue:nextDate
    }
}, {
    freezeTableName: true,
    tableName: "orderProduct",
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = OrderProduct;