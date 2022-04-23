const router = require("express").Router();
const ProductTag = require("../models/productTag");
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const { sequelizeDev, sequelizeTest } = require("../settings/database")


// GET TAGS FOR PRODUCTS
router.get("/productTags", async (request, response) => {
    try {
        const productTags = await ProductTag.findAll({
            where: {
                productId: { [Op.in]: request.query.productIds }
            }
        })
        return response.status(200).json({
            "response": productTags
        })
    }
    catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// GET ALL CATEGORIES TAGS FOR FRONT END DROPDOWN
router.get("/productTagsNames", async (request, response) => {
    try {
        var tagNames = []
        const tags = await sequelizeDev.query('SELECT DISTINCT name FROM "productTag"', {
            model: ProductTag
        })
        for (let i = 0; i < tags.length; i++) {
            tagNames.push(tags[i].name)
        }
        return response.status(200).json({
            "response": tagNames
        })
    }
    catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


// ADD PRODUCT TAGS 
router.post("/productTags", async (request, response) => {
    try {
        var productTags = []
        const now = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')
        for (let i = 0; i < request.body.productTagsNames.length; i++) {
            let buffer = {}
            buffer.productId = request.body.productId
            buffer.name = request.body.productTagsNames[i]
            buffer.created_at = now
            buffer.updated_at = now
            productTags.push(buffer)
            buffer = {}
        }
        const productTagsToSave = await ProductTag.bulkCreate(productTags)
        return response.status(productTagsToSave.status).json({
            "response": productTagsToSave
        });
    } catch (error) {
        console.log(error)
        if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(409).json({
                "response": "Tag already existant for current product"
            });
        }
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


module.exports = router;