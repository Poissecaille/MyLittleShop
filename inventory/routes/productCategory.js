const router = require("express").Router();
const ProductCategory = require("../models/productCategory");
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const { sequelizeDev, sequelizeTest } = require("../settings/database");
const logger = require("../settings/logger");

// GET CATEGORIES FOR PRODUCTS
router.get("/productCategories", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, query:${request.query}`)
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
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, query:${request.query}`)
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
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        const productCategories = await ProductCategory.findAll({
            where: {
                name: { [Op.in]: request.body.categories }
            }
        })
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
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        var productCategories = []
        const now = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')
        for (let i = 0; i < request.body.categoriesToCreate.length; i++) {
            let buffer = {}
            buffer.productId = request.body.productId
            buffer.name = request.body.categoriesToCreate[i]
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
            logger.error(`timestamp:${loggerDate}, errorName:${error.name}, queryParameters:${error.parent.parameters}`)
            return response.status(409).json({
                "response": "Category already existant for current product"
            });
        }
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// REMOVE PRODUCT CATEGORIES
router.delete("/productCategories", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        const productCategoriesToDelete = ProductCategory.destroy({
            where: {
                name: categoriesToDelete,
                productId: productId
            }
        });
        return response.status(productCategoriesToDelete.status).json({
            "response": productCategoriesToDelete
        });
    }
    catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;