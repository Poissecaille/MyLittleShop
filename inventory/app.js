const express = require("express");
const env = require("dotenv").config();
const db = require("./settings/database")
const ProductCategory = require("./models/productCategory");
const ProductTag = require("./models/productTag");
const Product = require("./models/product");


// DB CONNECTION
db.authenticate().
    then(() => console.log(`Connected to data base ${process.env.DB_NAME}...`))
    .catch((error) => console.log(error));


// DB ASSOCIATIONS
ProductCategory.hasMany(Product)
ProductTag.hasMany(Product)

// ProductCategory.sync({force:true}).then(() => { console.log("success1"), ProductTag.sync({force:true}) }
// ).then(() => { console.log("success2"), Product.sync({force:true}) }).then(() => { console.log("success3") })
// console.log("success4")

//Product.sync()
//Product.hasMany(ProductCategory)
//// Product.hasMany(ProductTag)

//console.log("ASSOCIATION!!!!!")
//ProductCategory.hasMany(Product);
// Product.belongsTo(ProductCategory);
//ProductTag.hasMany(Product);
// Product.belongsTo(ProductTag);


// DB SYNC
db.sync({ force: false }).
    then(
        () => console.log(`database ${process.env.DB_NAME} synced!`)
    )
    .catch((error) => console.log(error));

const app = express();

//ROUTES
const productRoute = require("./routes/product");
app.use(express.json());
app.use("/api/", productRoute);

//NETWORK SETTINGS
app.listen(process.env.APP_PORT, () => {
    console.log(`Backend is running on port ${process.env.APP_PORT}`);
});