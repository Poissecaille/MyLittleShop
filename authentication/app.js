const express = require("express");
const env = require("dotenv").config();
const db = require("./settings/database")


// DB CONNECTION
db.authenticate().
    then(() => console.log(`Connected to data base ${process.env.DB_NAME}...`))
    .catch((error) => console.log(error));

// DB SYNC
db.sync({ force: true }).
    then(
        () => console.log(`database ${process.env.DB_NAME} synced!`)
    )
    .catch((error) => console.log(error));


const app = express();

//ROUTES
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

app.use(express.json());
app.use("/api/auth/", authRoute);
app.use("api/user/", userRoute);
//NETWORK SETTINGS
app.listen(process.env.APP_PORT || 5000, () => {
    console.log(`Backend is running on port ${process.env.PORT || 5000}`);
});