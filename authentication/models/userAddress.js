var db = require("../settings/database");
const { DataTypes } = require('sequelize');
process.env.NODE_ENV === "development" ? db = db.sequelizeDev : db = db.sequelizeTest

const userAddress = db.define('userAddress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address1: {
        type: DataTypes.STRING, unique: 'compositePk', allowNull: false,
    },
    address2: {
        type: DataTypes.STRING, unique: 'compositePk', allowNull: false,
    },
    address3: {
        type: DataTypes.STRING, unique: false, allowNull: true,
    },
    city: {
        type: DataTypes.STRING, unique: false, allowNull: false
    },
    region: {
        type: DataTypes.STRING, unique: false, allowNull: false
    },
    country: {
        type: DataTypes.STRING, unique: false, allowNull: false
    },
    postalCode: {
        type: DataTypes.INTEGER, unique: false, allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "userAddress",
    createdAt: "created_at",
    updatedAt: "updated_at"
})

module.exports = userAddress;