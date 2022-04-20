const router = require("express").Router();
const ProductTag = require("../models/productTag");
const { QueryTypes } = require('sequelize');
const { sequelizeDev, sequelizeTest } = require("../settings/database")

// // GET SPECIFIC TAG DATA FOR PRODUCT FILTER
// router.get("/productTag", async (request, response) => {
//     try {
//         const productTag = await ProductTag.findOne({
//             where: {
//                 name: request.query.name
//             }
//         })
//         return response.status(200).json({
//             "response": productTag
//         })
//     }
//     catch (error) {
//         console.log(error)
//         response.status(error.response.status).json({
//             "response": error.response.data.response
//         });
//     }
// });


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


module.exports = router;