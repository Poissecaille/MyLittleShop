const express = require("express");
const env = require("dotenv").config();
const { sequelizeDev, sequelizeTest } = require("./settings/database")

// ENVIRONNEMENT SELECTION
var db;
if (process.env.NODE_ENV === "dev") {
    db = sequelizeDev
} else {
    db = sequelizeTest
}

// DB CONNECTION
db.authenticate().
    then(() => console.log(`Connected to data base ${process.env.DB_NAME}...`))
    .catch((error) => console.log(error));

// DB SYNC
db.sync().
    then(
        () => console.log(`database ${process.env.DB_NAME} synced!`)
    )
    .catch((error) => console.log(error));



const app = express();


//ROUTES
const users = require("./routes/users");
const products = require("./routes/products");
const cartProducts = require("./routes/cartProducts");
const userAddresses = require("./routes/userAddresses");
const orderProducts = require("./routes/orderProducts");

app.use(express.json());
app.use("/", users);
app.use("/", products);
app.use("/", cartProducts);
app.use("/", userAddresses);
app.use("/", orderProducts);

//NETWORK SETTINGS
app.listen(process.env.APP_PORT, () => {
    console.log(`Backend is running on port ${process.env.APP_PORT}`);
});

