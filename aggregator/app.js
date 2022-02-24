const express = require("express");
const env = require("dotenv").config();

//ROUTES
const users = require("./routes/users");
const products = require("./routes/products");
const cartProducts = require("./routes/cartProducts");
const userAddresses = require("./routes/userAddresses");
const orderProducts = require("./routes/orderProducts");

const app = express();

app.use(express.json());
app.use("/", users);
app.use("/", products);
app.use("/", cartProducts);
app.use("/", userAddresses);
app.use("/", orderProducts);



module.exports = app;