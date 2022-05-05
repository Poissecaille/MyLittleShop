const express = require("express");
const env = require("dotenv").config();
const cors = require('cors');
const productCategory = require("./models/productCategory");
const productTag = require("./models/productTag");
const product = require("./models/product");
const { sequelizeDev, sequelizeTest } = require("./settings/database")
const execSync = require('child_process').execSync;
const logger = require('./settings/logger');

// ENVIRONNEMENT SELECTION
var db;
var dbName;
var force;

// DB ASSOCIATIONS
product.hasMany(productCategory);
product.hasMany(productTag);


if (process.env.NODE_ENV === "development") {
    db = sequelizeDev
    dbName = process.env.DB_NAME
    force = false
    // DB CONNECTION
    db.authenticate().
        then(() => logger.info(`Connected to data base ${dbName}...`))
        .catch((error) => logger.error(error));

    // DB SYNC
    db.sync({ force: force }).
        then(
            () => {
                logger.info(`database ${dbName} synced!`)
                try {
                    execSync('npx sequelize-cli  db:seed --seed 20220205145748-products.js', { encoding: 'utf-8' });
                } catch (error) { logger.error(error) }
                try {
                    execSync('npx sequelize-cli  db:seed --seed 20220205122444-categories.js', { encoding: 'utf-8' });
                } catch (error) { logger.error(error) }
                try {
                    execSync('npx sequelize-cli  db:seed --seed 20220213104607-tags.js', { encoding: 'utf-8' });
                } catch (error) { logger.error(error) }
            }
        )
        .catch((error) => logger.error(error));

} else if (process.env.NODE_ENV === "test") {
    db = sequelizeTest
    dbName = process.env.DBTEST_NAME
    force = true
}

const app = express();

//ROUTES
const productRoute = require("./routes/product");
const cartProductRoute = require("./routes/cartProduct");
const ratingProductRoute = require("./routes/ratingProduct");
const productCategoriesRoute = require("./routes/productCategory");
const productTagsRoute = require("./routes/productTag");
const wishProductsRoute = require("./routes/wishProduct");

app.use(express.json());
app.use(cors());
app.use("/api/", productRoute);
app.use("/api/", cartProductRoute);
app.use("/api/", ratingProductRoute);
app.use("/api/", productCategoriesRoute);
app.use("/api/", productTagsRoute);
app.use("/api/", wishProductsRoute);

module.exports = app;
