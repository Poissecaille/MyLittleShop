const express = require("express");
const env = require("dotenv").config();
const productCategory = require("./models/productCategory");
const productTag = require("./models/productTag");
const product = require("./models/product");
const { sequelizeDev, sequelizeTest } = require("./settings/database")

//const cart = require("./models/cart");
//const cartProduct = require("./models/cartProduct");

// ENVIRONNEMENT SELECTION
var db;
var dbName;
var force;

if (process.env.NODE_ENV === "dev") {
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
productCategory.hasMany(product);
productTag.hasMany(product);
//cart.hasMany(cartProduct)

// DB SYNC
db.sync({ force: force }).
    then(
        () => console.log(`database ${dbName} synced!`)
    )
    .catch((error) => console.log(error));

const app = express();

//ROUTES
const productRoute = require("./routes/product");
const cartProductRoute = require("./routes/cartProduct");
app.use(express.json());
app.use("/api/", productRoute);
app.use("/api/", cartProductRoute);

//NETWORK SETTINGS
app.listen(process.env.APP_INVENTORY_PORT, () => {
    console.log(`Backend is running on port ${process.env.APP_INVENTORY_PORT}`);
});