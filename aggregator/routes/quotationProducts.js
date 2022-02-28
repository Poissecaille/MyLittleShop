const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    USER_DATA_URL: "http://localhost:5002/api/userData",
    CHECK_TOKEN_URL: "http://localhost:5002/api/checkToken",
    // INVENTORY MICROSERVICE
    BUYER_PRODUCT_URL: "http://localhost:5003/api/buyer/product",
    // ORDER MICROSERVICE
    GET_SELLER_ORDERS_URL: "http://localhost:5001/api/seller/orderProducts",
    GET_BUYER_ORDERS_URL: "http://localhost:5001/api/buyer/orderProducts",
    RATE_PRODUCT_URL: "http://localhost:5001/quotationProduct"
}

//POST A QUOTATION ON AN ORDERED PRODUCT
router.post("/quotationProduct", async, (request, response) => {
    try {
        if (!request.body.productName || !request.body.sellerUsername || !request.body.quotationValue) {
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
            const sellerData = await axios.get(roads.USER_DATA_URL, {
                params: {
                    sellerUsername: request.body.sellerUsername
                }
            });
            if (!sellerData) {
                return response.status(404).json({
                    "response": "User not found"
                })
            }
            const productToRate = await axios.get(roads.BUYER_PRODUCT_URL, {
                params: {
                    sellerId: request.body.sellerName,
                    productName: sellerData.data.response.id
                }
            });
            if (!productToRate) {
                return response.status(404).json({
                    "response": "Product not found"
                });
            }
            const buyerOrders = await axios.get(roads.GET_BUYER_ORDERS_URL, {
                params: {
                    ownerId: userId,
                    productId: productToRate.data.response.id,
                    sellerId: sellerData.data.response.id,
                    orderStatus: "delivered"
                }
            });
            if (buyerOrders.length == 0) {
                return response.status(404).json({
                    "response": "Order not found"
                });
            } else {
                const quotation = await axios.post(roads.RATE_PRODUCT_URL, {
                    ownerId: userId,
                    productId: productToRate.data.response.id,
                    quotationValue: request.body.quotationValue,
                    quotationComment: request.body.comment ? request.body.comment : null
                })
                return response.status(quotation.status).json({
                    "response": quotation.data.response
                });
            }
        } else {
            return response.status(401).json({
                "reponse": "Unauthorized"
            });
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});