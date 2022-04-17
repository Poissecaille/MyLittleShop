const router = require("express").Router();
const axios = require('axios');

const roads = {
    // INVENTORY MICROSERVICE
    GET_CART_ITEMS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/cartProducts`,
    CART_MANAGEMENT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/cartProduct`,
    SYNC_CART_ITEMS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productsPerId`,
    // USER MICROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    USER_DATA_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userData`,
    SYNC_CART_ITEMS_SELLERS_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/syncSellersPerProduct`
}

// CONSULT ALL PRODUCTS IN CART
router.get("/cartProduct", async (request, response) => {
    const user = await axios.get(roads.CHECK_TOKEN_URL, {
        headers: {
            'Authorization': request.headers.authorization
        }
    });
    const userId = user.data.response.id
    const userRole = user.data.response.role
    if (userRole == "buyer") {
        const cart = await axios.get(roads.GET_CART_ITEMS_URL, {
            params: {
                userId: userId
            }
        });
        return response.status(cart.status).json({
            "response": cart.data.response
        });
    } else {
        return response.status(401).json({ "response": "Unauthorized" });
    }
});

// ADD A PRODUCT IN CART
router.post("/cartProduct", async (request, response) => {
    try {
        if (!request.body.productName || !request.body.sellerUsername || !request.body.quantity || request.body.quantity == 0) {
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
            const newCartProduct = await axios.post(roads.CART_MANAGEMENT_URL, {
                userId: userId,
                sellerId: sellerData.data.response.id,
                productName: request.body.productName,
                quantity: request.body.quantity,
            });
            return response.status(newCartProduct.status).json({
                "response": newCartProduct.data.response
            });
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        console.log(error)
        if (error instanceof TypeError && error.code === "ERR_HTTP_INVALID_HEADER_VALUE") {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// MODIFY CART
router.put("/cartProduct", async (request, response) => {
    try {
        console.log(request.body)
        if (!request.body.productName || !request.body.sellerUsername || !request.body.quantity || request.body.quantity == 0) {
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

            const cartToUpdate = await axios.put(roads.CART_MANAGEMENT_URL, {
                userId: userId,
                productName: request.body.productName,
                sellerId: sellerData.data.response.id,
                quantity: request.body.quantity,
                quantityVariation: request.body.quantityVariation
            });
            return response.status(cartToUpdate.status).json({
                "response": cartToUpdate.data.response
            });
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// REMOVE PRODUCT FROM CART
router.delete("/cartProduct", async (request, response) => {
    try {
        console.log(request.body)
        if (!request.body.productName || !request.body.sellerUsername) {
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
            const newCart = await axios.delete(roads.CART_MANAGEMENT_URL, {
                data: {
                    userId: userId,
                    productName: request.body.productName,
                    sellerId: sellerData.data.response.id
                }
            });
            return response.status(newCart.status).json({
                "response": newCart.data.response
            });
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//CART REFRESH
router.get("/syncCart", async (request, response) => {
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole !== "buyer") {
            return response.status(401).json({ "response": "Unauthorized" });
        }
        else {
            const cart = await axios.get(roads.GET_CART_ITEMS_URL, {
                params: {
                    userId: userId
                }
            });
            console.log("ASSERTION:", cart.data.response)
            if (cart.data.response.length === 0) {
                return response.status(200).json({
                    "response": cart.data.response
                });
            }
            var productIds = [];
            for (let i = 0; i < cart.data.response.length; i++) {
                productIds.push(cart.data.response[i].productId)
            }

            const cartProductsData = await axios.get(roads.SYNC_CART_ITEMS_URL, {
                params: {
                    productIds
                }
            });
            var sellerIds = [];
            console.log("#########")
            console.log(cartProductsData.data.response)
            for (let i = 0; i < cartProductsData.data.response.length; i++) {
                sellerIds.push(cartProductsData.data.response[i].sellerId)
            }

            const cartProductsSellerData = await axios.get(roads.SYNC_CART_ITEMS_SELLERS_URL, {
                params: {
                    sellerIds
                }
            });
            for (let i = 0; i < cart.data.response.length; i++) {
                for (let j = 0; j < cartProductsData.data.response.length; j++) {
                    if (cart.data.response[i].productId === cartProductsData.data.response[j].id) {
                        cartProductsData.data.response[i].quantity = cart.data.response[i].quantity
                    }
                    for (let k = 0; k < cartProductsSellerData.data.response.length; k++) {
                        if (cartProductsData.data.response[j].sellerId === cartProductsSellerData.data.response[k].id) {
                            cartProductsData.data.response[j].sellerUsername = cartProductsSellerData.data.response[k].username
                        }
                    }
                }
            }
            return response.status(200).json({
                "response": cartProductsData.data.response
            });
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;