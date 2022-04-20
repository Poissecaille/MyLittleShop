const express = require("express");
const env = require("dotenv").config();
const cors = require('cors');

//ROUTES
const users = require("./routes/users");
const products = require("./routes/products");
const cartProducts = require("./routes/cartProducts");
const userAddresses = require("./routes/userAddresses");
const orderProducts = require("./routes/orderProducts");
const ratingProducts = require("./routes/ratingProducts");
const productCategories = require("./routes/productCategories");
const productTags = require("./routes/productTags");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", users);
app.use("/", products);
app.use("/", cartProducts);
app.use("/", userAddresses);
app.use("/", orderProducts);
app.use("/", ratingProducts);
app.use("/", productCategories);
app.use("/", productTags);

module.exports = app;