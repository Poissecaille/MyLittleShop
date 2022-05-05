const router = require("express").Router();
const axios = require('axios');
const averageFromArray = require("../utils/functions");
var logger = require('../settings/logger');

const roads = {
    // AUTHENTICATION MICROSERVICE
    USER_DATA_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userData`,
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    // INVENTORY MICROSERVICE
    BUYER_PRODUCT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/buyer/product`,
    RATE_PRODUCT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/ratingProduct`,
    GET_RATINGS_PER_PRODUCTS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/ratingsProducts`,
    UPDATE_PRODUCT_AVERAGE_RATING: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/updateProductRating`,
    GET_RATINGS_PER_USER_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/ratingsProductsPerUser`,
    // ORDER MICROSERVICE
    GET_SELLER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/seller/orderProducts`,
    GET_BUYER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/buyer/orderProducts`,
}

//GET RATED PRODUCT FOR A USER FOR ORDER PAGE
router.get("/ratingsProductsPerUser", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole === "buyer") {
            const ratings = await axios.get(roads.GET_RATINGS_PER_USER_URL, {
                params: {
                    ownerId: userId
                }
            });
            logger.info(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body}
                query:${request.query},
                response:${ratings.data.response}`)
            return response.status(ratings.status).json({
                "response": ratings.data.response
            });
        }
    }
    catch (error) {
        logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response: ${error.response.data.response}`)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//POST A RATING ON AN ORDERED PRODUCT
router.post("/ratingProduct", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        console.log(request.body)
        if (!request.body.productId || !request.body.value || request.body.value < 0 && request.body.value > 5) {
            logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: Bad json format`)
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        var rates = [];
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole == "buyer") {
            const newRating = await axios.post(roads.RATE_PRODUCT_URL, {
                ownerId: userId,
                productId: request.body.productId,
                value: request.body.value,
                comment: request.body.comment ? request.body.comment : null
            })
            const allProductRatings = await axios.get(roads.GET_RATINGS_PER_PRODUCTS_URL, {
                params: {
                    productId: request.body.productId
                }
            }, {
                headers: {
                    'Authorization': request.headers.authorization
                }
            });
            for (let i = 0; i < allProductRatings.data.response.length; i++) {
                rates.push(allProductRatings.data.response[i].value)
            }
            const newAverage = averageFromArray(rates);
            await axios.put(roads.UPDATE_PRODUCT_AVERAGE_RATING,
                {
                    averageRating: newAverage,
                    productId: request.body.productId
                })
            logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${newRating.data.response}`) 
            return response.status(newRating.status).json({
                "response": newRating.data.response
            });
        }
    } catch (error) {
        logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response:${error.response.data.response}`)

        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;