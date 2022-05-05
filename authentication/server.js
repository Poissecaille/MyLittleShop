const app = require("./app")
var logger=require('winston');

//NETWORK SETTINGS
app.listen(process.env.APP_AUTHENTICATION_PORT, () => {
   logger.info(`Backend is running on port ${process.env.APP_AUTHENTICATION_PORT}`)
});