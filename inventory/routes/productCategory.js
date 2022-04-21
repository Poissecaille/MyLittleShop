const router = require("express").Router();
const ProductCategory = require("../models/productCategory");
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const { sequelizeDev, sequelizeTest } = require("../settings/database")

// GET CATEGORIES FOR PRODUCTS
router.get("/productCategories", async (request, response) => {
    try {
        const productCategories = await ProductCategory.findAll({
            where: {
                productId:{[Op.in]:request.query.productIds}
            }
        })
        return response.status(200).json({
            "response": productCategories
        }) 
    }
    catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// GET ALL CATEGORIES NAMES FOR FRONT END DROPDOWN
router.get("/productCategoriesNames", async (request, response) => {
    try {
        var categoryNames = []
        const categories = await sequelizeDev.query('SELECT DISTINCT name FROM "productCategory"', {
            model: ProductCategory
        })
        for (let i = 0; i < categories.length; i++) {
            categoryNames.push(categories[i].name)
        }
        return response.status(200).json({
            "response": categoryNames
        })
    }
    catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


module.exports = router;