const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv").config();
const app = express();

const registerRoute = require("./routes/register")

mongoose.connect(
    process.env.MONGODB_URL
)
    .then((console.log("Connected to Mylittleshop!")))
    .catch((error) => { console.log(error); });
app.use(express.json());
app.use("/api/user/", registerRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend is running on port ${process.env.PORT || 5000}`);
});