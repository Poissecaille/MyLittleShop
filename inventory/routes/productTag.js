const router = require("express").Router();
const ProductTag = require("../models/productTag");
const { QueryTypes } = require('sequelize');
const { sequelizeDev, sequelizeTest } = require("../settings/database")

//GET ALL TAGS
router.get("/productTags", async (request, response) => {
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

module.exports = router;