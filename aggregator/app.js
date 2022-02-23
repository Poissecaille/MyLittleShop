const express = require("express");
const env = require("dotenv").config();
const { sequelizeDev, sequelizeTest } = require("./settings/database")

//ROUTES
const users = require("./routes/users");
const products = require("./routes/products");
const cartProducts = require("./routes/cartProducts");
const userAddresses = require("./routes/userAddresses");
const orderProducts = require("./routes/orderProducts");

// ENVIRONNEMENT SELECTION
var db;
var dbName;
if (process.env.NODE_ENV === "dev") {
    db = sequelizeDev
    dbName=process.env.DB_NAME
} else {
    db = sequelizeTest
    dbName = process.env.DBTEST_NAME
}

// DB CONNECTION
db.authenticate().
    then(() => console.log(`Connected to data base ${dbName}...`))
    .catch((error) => console.log(error));

// DB SYNC
db.sync().
    then(
        () => console.log(`database ${dbName} synced!`)
    )
    .catch((error) => console.log(error));

const app = express();

app.use(express.json());
app.use("/", users);
app.use("/", products);
app.use("/", cartProducts);
app.use("/", userAddresses);
app.use("/", orderProducts);



module.exports = app;