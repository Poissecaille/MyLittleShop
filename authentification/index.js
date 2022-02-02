const express = require("express");
const env = require("dotenv").config();
const db = require("./settings/database")

db.authenticate().
    then(() => console.log(`Connected to data base ${process.env.DB_NAME}...`))
    .catch((error) => console.log(error))


const app = express();

//ROUTES
const authRoute = require("./routes/auth")
app.use(express.json());
app.use("/api/auth/", authRoute);

//NETWORK SETTINGS
app.listen(process.env.APP_PORT || 5000, () => {
    console.log(`Backend is running on port ${process.env.PORT || 5000}`);
});