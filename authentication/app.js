const express = require("express");
const env = require("dotenv").config();
const userAddress = require("./models/userAddress");
const user = require("./models/user");
const { sequelizeDev, sequelizeTest } = require("./settings/database")
const cors = require('cors');
const execSync = require('child_process').execSync;

const winston = require('winston');
const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service: 'Authentication service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
  });


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
    .catch((error) => console.log(error));
    db.sync({ force: force }).
        then(
            () => {
                execSync('npx sequelize-cli  db:seed --seed 20220212150215-users.js', { encoding: 'utf-8' });
                console.log(`database ${dbName} synced!`)
            }
                
            
        )
        .catch((error) => logger.error(error));


} 
logger.error("test error")
logger.info("test info")
logger.debug("test debug")

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
