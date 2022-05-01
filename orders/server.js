const app = require("./app")

//NETWORK SETTINGS
app.listen(process.env.APP_ORDER_PORT, () => {
    console.log(`Backend is running on port ${process.env.APP_ORDER_PORT}`);
});