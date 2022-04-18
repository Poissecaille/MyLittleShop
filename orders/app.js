const express = require("express");
const env = require("dotenv").config();
const order = require("./models/order")
const orderProduct = require("./models/orderProduct");
const { sequelizeDev, sequelizeTest } = require("./settings/database")

// ENVIRONNEMENT SELECTION
var db;
var dbName;
var force;

if (process.env.NODE_ENV === "development") {
    db = sequelizeDev
    dbName = process.env.DB_NAME
    force = false
} else if (process.env.NODE_ENV === "test") {
    db = sequelizeTest
    dbName = process.env.DBTEST_NAME
    force = true
}


// DB CONNECTION
db.authenticate().
    then(() => console.log(`Connected to data base ${dbName}...`))
    .catch((error) => console.log(error));

// DB ASSOCIATIONS
//order.hasMany(orderProduct)

// DB SYNC
db.sync({ force: force }).
    then(
        () => console.log(`database ${dbName} synced!`)
    )
    .catch((error) => console.log(error));

const app = express();

//ROUTES
const orderProducts = require("./routes/orderProduct");
app.use(express.json());
app.use("/api/", orderProducts);

//NETWORK SETTINGS
app.listen(process.env.APP_ORDER_PORT, () => {
    console.log(`Backend is running on port ${process.env.APP_ORDER_PORT}`);
});