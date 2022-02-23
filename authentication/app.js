const express = require("express");
const env = require("dotenv").config();
const userAddress = require("./models/userAddress");
const user = require("./models/user");
const { sequelizeDev, sequelizeTest } = require("./settings/database")

// ENVIRONNEMENT SELECTION
var db;
var dbName;
if (process.env.NODE_ENV === "dev") {
    db = sequelizeDev
    dbName=process.env.DB_NAME
} else {
    db = sequelizeTest
    dbName = process.env.DBTEST_NAME
}

// DB CONNECTION
db.authenticate().
    then(() => console.log(`Connected to data base ${dbName}...`))
    .catch((error) => console.log(error));

// DB ASSOCIATIONS
user.hasMany(userAddress);

// DB SYNC
db.sync({ force: false }).
    then(
        () => console.log(`database ${dbName} synced!`)
    )
    .catch((error) => console.log(error));


const app = express();

//ROUTES
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const userAddressRoute = require("./routes/userAddress");

app.use(express.json());
app.use("/api/", authRoute);
app.use("/api/", userRoute);
app.use("/api/", userAddressRoute);

//NETWORK SETTINGS
app.listen(process.env.APP_AUTHENTICATION_PORT, () => {
    console.log(`Backend is running on port ${process.env.APP_AUTHENTICATION_PORT}`);
});