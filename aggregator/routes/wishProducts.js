const router = require("express").Router();
const axios = require('axios');

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
    try {
        if (!request.body.sellerUsername || !request.body.productName || !request.body.quantity) {
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
                });
            }
            // const wishedProduct = await axios.get(roads.BUYER_PRODUCT_URL, {
            //     params: {
            //         sellerId: request.body.sellerName,
            //         productName: sellerData.data.response.id
            //     }
            // });
            // if (!wishedProduct) {
            //     return response.status(404).json({
            //         "response": "Product not found"
            //     });
            // }
            const wishProduct = await axios.post(roads.CRUD_WISHLIST_URL, {
                ownerId: userId,
                productName: request.body.productName,
                sellerId: sellerData.data.response.id,
                quantity: request.body.quantity
            });
            return response.status(wishProduct.status).json({
                "response": wishProduct.data.response
            });
        } else {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

router.get("/wishProduct", async (request, response) => {
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
            return response.status(wishProducts.status).json({
                "response": wishProducts.data.response
            });
        } return response.status(401).json({
            "response": "Unauthorized"
        })
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


router.put("/wishProduct", async (request, response) => {
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
                return response.status(404).json({
                    "response": "User not found"
                });
            }
            const wishProductsToUpdate = await axios.put(roads.CRUD_WISHLIST_URL,
                {
                    ownerId: userId,
                    sellerId: sellerData.data.response.id,
                    productName: request.body.productName,
                    quantity: request.body.quantity
                });
            return response.status(wishProductsToUpdate.status).json({
                "response": wishProductsToUpdate.data.response
            });
        } else {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

router.delete("/wishProduct", async (request, response) => {
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
            return response.status(wishProductsToDelete.status).json({
                "response": wishProductsToDelete.data.response
            });
        } else {
            return response.status(401).json({
                "response": "Unauthorized"
            })
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});
