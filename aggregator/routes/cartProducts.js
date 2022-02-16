const router = require("express").Router();
const axios = require('axios');

const roads = {
    // CARTPRODUCT MICROSERVICE
    CART_URL: "http://localhost:5003/api/cartProduct",

    // USER MICROSERVICE
    CHECK_TOKEN_URL: "http://localhost:5002/api/checkToken"
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
    if (userRole === "admin" || userRole == "buyer") {
        const cart = await axios.get(roads.CART_URL, {
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

// ADD PRODUCTS IN CART
router.post("/cartProduct", async (request, response) => {
    if (!request.body.productName || !request.body.quantity) {
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
    try {
        if (userRole === "admin" || userRole == "buyer") {
            const newCart = await axios.post(roads.CART_URL, {
                userId: userId,
                productName: request.body.productName,
                quantity: request.body.quantity
            });
            return response.status(newCart.status).json({
                "response": newCart.data.response
            });
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// MODIFY CART
router.put("/cartProduct", async (request, response) => {
    if (!request.body.productName || !request.body.quantity) {
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
    try {
        if (userRole === "admin" || userRole == "buyer") {
            const newCart = await axios.put(roads.CART_URL, {
                userId: userId,
                productName: request.body.productName,
                quantity: request.body.quantity
            });
            return response.status(newCart.status).json({
                "response": newCart.data.response
            });
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// REMOVE PRODUCT FROM CART
router.delete("/cartProduct", async (request, response) => {
    if (!request.body.productName) {
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
    try {
        if (userRole === "admin" || userRole == "buyer") {
            const newCart = await axios.delete(roads.CART_URL, {
                data: {
                    userId: userId,
                    productName: request.body.productName
                }
            });
            return response.status(newCart.status).json({
                "response": newCart.data.response
            });
        } else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;