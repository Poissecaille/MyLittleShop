const express = require("express");
const env = require("dotenv").config();
const order = require("./models/order")
const orderProduct = require("./models/orderProduct");
const { sequelizeDev, sequelizeTest } = require("./settings/database")
const logger = require('./settings/logger');

// ENVIRONNEMENT SELECTION
var db;
var dbName;
var force;

if (process.env.NODE_ENV === "development") {
    db = sequelizeDev
    dbName = process.env.DB_NAME
    force = false
    // DB CONNECTION
    db.authenticate().
        then(() => logger.info(`Connected to data base ${dbName}...`))
        .catch((error) => logger.error(error));
    db.sync({ force: force }).
        then(
            () => {
                logger.info(`database ${dbName} synced!`)
            }


        )
        .catch((error) => logger.error(error));


}

// DB ASSOCIATIONS
//order.hasMany(orderProduct)


const app = express();

//ROUTES
const orderProducts = require("./routes/orderProduct");
app.use(express.json());
app.use("/api/", orderProducts);


module.exports = app;
