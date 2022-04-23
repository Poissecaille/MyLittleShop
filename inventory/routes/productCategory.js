const router = require("express").Router();
const ProductCategory = require("../models/productCategory");
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const { sequelizeDev, sequelizeTest } = require("../settings/database")

// GET CATEGORIES FOR PRODUCTS
router.get("/productCategories", async (request, response) => {
    try {
        console.log("inventory", request.query.productIds)
        const productCategories = await ProductCategory.findAll({
            where: {
                productId: { [Op.in]: request.query.productIds }
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

// MODIFY PRODUCT CATEGORIES
router.put("/productCategories", async (request, response) => {
    try {
        const productCategories = await ProductCategory.findAll({
            where: {
                name: { [Op.in]: request.body.categories }
            }
        })
        //await productCategories.update

    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// ADD PRODUCT CATEGORIES
router.post("/productCategories", async (request, response) => {
    try {
        var productCategories = []
        const now = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')
        for (let i = 0; i < request.body.productCategoriesNames.length; i++) {
            let buffer = {}
            buffer.productId = request.body.productId
            buffer.name = request.body.productCategoriesNames[i]
            buffer.created_at = now
            buffer.updated_at = now
            productCategories.push(buffer)
            buffer = {}
        }
        const productCategoriesToSave = await ProductCategory.bulkCreate(productCategories)
        return response.status(productCategoriesToSave.status).json({
            "response": productCategoriesToSave
        });
    } catch (error) {
        console.log(error)
        if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(409).json({
                "response": "Category already existant for current product"
            });
        }
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


module.exports = router;