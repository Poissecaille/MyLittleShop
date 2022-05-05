const express = require("express");
const env = require("dotenv").config();
const cors = require('cors');

//CRON
const scheduledFunctions = require("./scheduled_jobs/newsletter");

//ROUTES
const users = require("./routes/users");
const products = require("./routes/products");
const cartProducts = require("./routes/cartProducts");
const userAddresses = require("./routes/userAddresses");
const orderProducts = require("./routes/orderProducts");
const ratingProducts = require("./routes/ratingProducts");
const productCategories = require("./routes/productCategories");
const productTags = require("./routes/productTags");
const wishProducts = require("./routes/wishProducts");
const admin = require("./routes/admin");

const app = express();

scheduledFunctions.newsLetter();

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
app.use("/", wishProducts);
app.use("/", admin);

module.exports = app;