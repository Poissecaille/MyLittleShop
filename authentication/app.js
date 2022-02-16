const express = require("express");
const env = require("dotenv").config();
const db = require("./settings/database")
const userAddress = require("./models/userAddress");
const user = require("./models/user");

// DB CONNECTION
db.authenticate().
    then(() => console.log(`Connected to data base ${process.env.DB_NAME}...`))
    .catch((error) => console.log(error));

// DB ASSOCIATIONS
user.hasMany(userAddress);

// DB SYNC
db.sync({ force: false }).
    then(
        () => console.log(`database ${process.env.DB_NAME} synced!`)
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
app.listen(process.env.APP_PORT, () => {
    console.log(`Backend is running on port ${process.env.APP_PORT}`);
});