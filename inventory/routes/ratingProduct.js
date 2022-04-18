const router = require("express").Router();
const Sequelize = require('sequelize');
const RatingProduct = require("../models/ratingProduct");
const Op = Sequelize.Op

// DEDICATED ROAD FOR PRODUCTS AVERAGE RATING
router.get("/ratingsProducts", async (request, response) => {
    try {
        const productRatings = await RatingProduct.findAll({
            where: {
                productId: request.query.productId
            }
        });
        return response.status(200).json({
            "response": productRatings.data.response,
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
})

//POST A RATING ON AN ORDERED PRODUCT
router.post("/ratingProduct", async (request, response) => {
    try {
        const rating = new RatingProduct({
            ownerId: request.body.ownerId,
            productId: request.body.productId,
            value: request.body.value,
            comment: request.body.comment ? request.body.comment : null
        });
        await rating.save()
        return response.status(201).json({
            "response": "Rating created"
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;