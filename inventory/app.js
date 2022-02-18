const express = require("express");
const env = require("dotenv").config();
const db = require("./settings/database")
const productCategory = require("./models/productCategory");
const productTag = require("./models/productTag");
const product = require("./models/product");
const cart = require("./models/cart");
const cartProduct = require("./models/cartProduct");


// DB CONNECTION
db.authenticate().
    then(() => console.log(`Connected to data base ${process.env.DB_NAME}...`))
    .catch((error) => console.log(error));


// DB ASSOCIATIONS
productCategory.hasMany(product);
productTag.hasMany(product);
cart.hasMany(cartProduct)

// DB SYNC
db.sync({ force: true }).
    then(
        () => console.log(`database ${process.env.DB_NAME} synced!`)
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
app.listen(process.env.APP_PORT, () => {
    console.log(`Backend is running on port ${process.env.APP_PORT}`);
});