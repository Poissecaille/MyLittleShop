const express = require("express");
const env = require("dotenv").config();
const db = require("./settings/database");
//const order = require("./models/order")
//const orderProduct = require("./models/orderProduct");

// DB CONNECTION
db.authenticate().
    then(() => console.log(`Connected to data base ${process.env.DB_NAME}...`))
    .catch((error) => console.log(error));


// DB ASSOCIATIONS
//order.hasMany(orderProduct)

// DB SYNC
db.sync({ force: false }).
    then(
        () => console.log(`database ${process.env.DB_NAME} synced!`)
    )
    .catch((error) => console.log(error));

const app = express();

//ROUTES
const orderProducts = require("./routes/orderProduct");
app.use(express.json());
app.use("/api/", orderProducts);

//NETWORK SETTINGS
app.listen(process.env.APP_PORT, () => {
    console.log(`Backend is running on port ${process.env.APP_PORT}`);
});