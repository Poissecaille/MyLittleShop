const router = require("express").Router();
const Sequelize = require('sequelize');
const RatingProduct = require("../models/ratingProduct");
const Op = Sequelize.Op
var logger = require('../settings/logger');

// DEDICATED ROAD FOR PRODUCTS AVERAGE RATING
router.get("/ratingsProducts", async (request, response) => {
    try {
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, query:${request.query}`)
        logger.debug(`productIds: ${request.query.productIds}`)
        const productRatings = await RatingProduct.findAll({
            where: {
                productId: request.query.productId
            }
        });
        return response.status(200).json({
            "response": productRatings
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// DEDICATED ROAD FOR ALL RATES PER USER
router.get("/ratingsProductsPerUser", async (request, response) => {
    try {
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, query:${request.query}`)
        logger.debug(`productIds: ${request.query.productIds}`)
        const productRatings = await RatingProduct.findAll({
            where: {
                ownerId: request.query.ownerId
            }
        });
        return response.status(200).json({
            "response": productRatings
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


//POST A RATING ON AN ORDERED PRODUCT
router.post("/ratingProduct", async (request, response) => {
    try {
        logger.info(loggerDate, request.headers, request.url, request.method, request.body)
        logger.debug(`productIds: ${request.query.productIds}`)
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
        if (error.name === "SequelizeUniqueConstraintError") {
            logger.error(`timestamp:${loggerDate}, errorName:${error.name}, queryParameters:${error.parent.parameters}`)
            return response.status(409).json({
                "response": "Product already rated"
            });
        }
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;