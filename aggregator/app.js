const express = require("express");
const env = require("dotenv").config();
const db = require("./settings/database");
//const axios = require('axios');
//const httpProxy = require('http-proxy');


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

// PROXY
// const proxy = httpProxy.createProxyServer({});
// const app = express();

// app.get('*', (request, response) => {
//     console.log('Request', request, response);
//     proxy.web(request, response, {
//         target: `${req.protocol}://${req.hostname}`
//     });
// });
// const server = app.listen(5000);

// const res = await axios.post("http://localhost:5002/api/auth/register/", {
//     host: 'localhost',
//     port: 5000
// });
// console.log(res.data);
const app = express();


//ROUTES
const disableRoute = require("./routes/users");

app.use(express.json());
app.use("/", disableRoute);

//NETWORK SETTINGS
app.listen(process.env.APP_PORT || 5000, () => {
    console.log(`Backend is running on port ${process.env.PORT || 5000}`);
});