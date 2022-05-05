const express = require("express");
const env = require("dotenv").config();
const userAddress = require("./models/userAddress");
const user = require("./models/user");
const { sequelizeDev, sequelizeTest } = require("./settings/database")
const cors = require('cors');
const execSync = require('child_process').execSync;
const logger=require('./settings/logger');

// ENVIRONNEMENT SELECTION
var db;
var dbName;
var force;

// DB ASSOCIATIONS
user.hasMany(userAddress);

if (process.env.NODE_ENV === "development") {
  db = sequelizeDev
  dbName = process.env.DB_NAME
  force = false
  // DB CONNECTION
  db.authenticate().
    then(() => logger.info(`Connected to data base ${dbName}...`))
    .catch((error) => logger.error(error));
  db.sync({ force: force }).
    then(
      () => {
        execSync('npx sequelize-cli  db:seed --seed 20220212150215-users.js', { encoding: 'utf-8' });
        logger.info(`database ${dbName} synced!`)
      }
    )
    .catch((error) => logger.error(error));


}

const app = express();
//ROUTES
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const userAddressRoute = require("./routes/userAddress");

app.use(express.json());
app.use(cors());
app.use("/api/", authRoute);
app.use("/api/", userRoute);
app.use("/api/", userAddressRoute);

module.exports = app;
