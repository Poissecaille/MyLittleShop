const router = require("express").Router();
const axios = require('axios');
const averageFromArray = require("../utils/functions");

const roads = {
    // USER MICROSERVICE
    USER_DATA_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userData`,
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    // INVENTORY MICROSERVICE
    BUYER_PRODUCT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/buyer/product`,
    RATE_PRODUCT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/ratingProduct`,
    GET_RATINGS_PER_PRODUCTS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/ratingsProducts`,
    UPDATE_PRODUCT_AVERAGE_RATING: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/updateProductRating`,
    // ORDER MICROSERVICE
    GET_SELLER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/seller/orderProducts`,
    GET_BUYER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/buyer/orderProducts`,
}

//POST A RATING ON AN ORDERED PRODUCT
router.post("/ratingProduct", async (request, response) => {
    try {
        console.log(request.body)
        if (!request.body.productId || !request.body.value) {
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
            for (let i = 0; i > allProductRatings.data.response.length; i++) {
                rates.push(allProductRatings.data.response[i].value)
            }
            const newAverage = averageFromArray(rates);
            await axios.put(roads.UPDATE_PRODUCT_AVERAGE_RATING,
                {
                    averageRating: newAverage
                })
            console.log("########")
            console.log(newAverage)
            console.log("########")
            return response.status(newRating.status).json({
                "response": newRating.data.response
            });
        }
        // const sellerData = await axios.get(roads.USER_DATA_URL, {
        //     params: {
        //         sellerUsername: request.body.sellerUsername
        //     }
        // });
        // if (!sellerData) {
        //     return response.status(404).json({
        //         "response": "User not found"
        //     })
        // }
        // const productToRate = await axios.get(roads.BUYER_PRODUCT_URL, {
        //     params: {
        //         sellerId: request.body.sellerName,
        //         productName: sellerData.data.response.id
        //     }
        // });
        // if (!productToRate) {
        //     return response.status(404).json({
        //         "response": "Product not found"
        //     });
        // }
        //     const buyerOrders = await axios.get(roads.GET_BUYER_ORDERS_URL, {
        //         params: {
        //             ownerId: userId,
        //             productId: productToRate.data.response.id,
        //             sellerId: sellerData.data.response.id,
        //             orderStatus: "delivered"
        //         }
        //     });
        //     if (buyerOrders.length == 0) {
        //         return response.status(404).json({
        //             "response": "Order not found"
        //         });
        //     } else {
        //         const quotation = await axios.post(roads.RATE_PRODUCT_URL, {
        //             ownerId: userId,
        //             productId: productToRate.data.response.id,
        //             quotationValue: request.body.quotationValue,
        //             quotationComment: request.body.comment ? request.body.comment : null
        //         })
        //         return response.status(quotation.status).json({
        //             "response": quotation.data.response
        //         });
        //     }
        // } else {
        //     return response.status(401).json({
        //         "reponse": "Unauthorized"
        //     });
        // }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;