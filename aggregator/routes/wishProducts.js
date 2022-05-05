const router = require("express").Router();
const axios = require('axios');
var logger = require('../settings/logger');
const roads = {
    // INVENTORY MICROSERVICE
    CRUD_WISHLIST_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/wishProduct`,
    GET_WISHLIST_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/wishProducts`,
    // AUTHENTICATION MICROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    USER_DATA_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userData`
}

// ADD A PRODUCT IN WISHLIST
router.post("/wishProduct", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        if (!request.body.productId || !request.body.quantity || !request.body.availableQuantity) {
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
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole == "buyer") {
        
            const wishProduct = await axios.post(roads.CRUD_WISHLIST_URL, {
                ownerId: userId,
                productId: request.body.productId,
                availableQuantity: request.body.availableQuantity,
                //productName: request.body.productName,
                //sellerId: request.body.sellerId,
                // sellerId: sellerData.data.response.id,
                quantity: request.body.quantity
            });
            logger.info(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body}
                query:${request.query},
                response:${wishProduct.data.response}`)
            return response.status(wishProduct.status).json({
                "response": wishProduct.data.response
            });
        } else {
            logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response: Unauthorized`)
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
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

// GET ALL PRODUCTS FROM USER WISHLIST
router.get("/wishProducts", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole == "buyer") {
            const wishProducts = await axios.get(roads.GET_WISHLIST_URL, {
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
                response:${wishProducts.data.response}`)
            return response.status(wishProducts.status).json({
                "response": wishProducts.data.response
            });
        }
        logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response: Unauthorized`) 
        return response.status(401).json({
            "response": "Unauthorized"
        })
    } catch (error) {
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


router.put("/wishProduct", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole == "buyer") {
            const sellerData = await axios.get(roads.USER_DATA_URL, {
                params: {
                    sellerUsername: request.body.sellerUsername
                }
            });
            if (!sellerData) {
                logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: User not found`)
                return response.status(404).json({
                    "response": "User not found"
                });
            }
            const wishProductsToUpdate = await axios.put(roads.CRUD_WISHLIST_URL,
                {
                    ownerId: userId,
                    sellerId: sellerData.data.response.id,
                    sellerUsername: sellerData.data.response.username,
                    productName: request.body.productName,
                    quantity: request.body.quantity
                });
            logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${wishProductsToUpdate.data.response}`)
            return response.status(wishProductsToUpdate.status).json({
                "response": wishProductsToUpdate.data.response
            });
        } else {
            logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response: Unauthorized`)
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
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

router.delete("/wishProduct", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole == "buyer") {

            const sellerData = await axios.get(roads.USER_DATA_URL, {
                params: {
                    sellerUsername: request.body.sellerUsername
                }
            });

            if (!sellerData) {
                logger.error(`timestamp:${loggerDate}, 
                    headers:${request.headers}, 
                    url:${request.url}, 
                    method:${request.method}, 
                    body:${request.body},
                    query:${request.query},
                    response: User not found`)
                return response.status(404).json({
                    "response": "User not found"
                });
            }
            const wishProductsToDelete = await axios.delete(roads.CRUD_WISHLIST_URL, {
                data: {
                    ownerId: userId,
                    sellerId: sellerData.data.response.id,
                    productName: request.body.productName,
                }
            })
            logger.info(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body}
                query:${request.query},
                response:${wishProductsToDelete.data.response}`)
            return response.status(wishProductsToDelete.status).json({
                "response": wishProductsToDelete.data.response
            });
        } else {
            logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: Unauthorized`)

            return response.status(401).json({
                "response": "Unauthorized"
            })
        }
    } catch (error) {
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

module.exports = router;