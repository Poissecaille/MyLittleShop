const express = require("express");
const env = require("dotenv").config();
const order = require("./models/order")
const orderProduct = require("./models/orderProduct");
const quotationProduct = require('./models/quotationProduct');
const { sequelizeDev, sequelizeTest } = require("./settings/database")

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
    then(() => console.log(`Connected to data base ${dbName}...`))
    .catch((error) => console.log(error));
    db.sync({ force: force }).
        then(
            () => {
                console.log(`database ${dbName} synced!`)
            }
                
            
        )
        .catch((error) => console.log(error));


} 

// DB ASSOCIATIONS
//order.hasMany(orderProduct)


const app = express();

//ROUTES
const orderProducts = require("./routes/orderProduct");
app.use(express.json());
app.use("/api/", orderProducts);


module.exports = app;
