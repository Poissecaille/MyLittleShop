const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    CHECK_TOKEN_URL: "http://localhost:5002/api/checkToken",
    GET_ONE_USER_ADDRESS_URL: "http://localhost:5002/api/userAddress",
    //INVENTORY MICROSERVICE
    CART_URL: "http://localhost:5003/api/cartProducts",
    BUYER_PRODUCT_URL: "http://localhost:5003/api/buyer/products",
    SELLER_PRODUCTS_URL: "http://localhost:5003/api/seller/products",
    UPDATE_PRODUCTS_STOCKS: "http://localhost:5003/api/products",
    //ORDER MICROSERVICE
    CREATE_ORDER_URL: "http://localhost:5001/api/orderProducts",
    GET_SELLER_ORDERS_URL: "http://localhost:5001/api/seller/orderProducts",
    GET_BUYER_ORDERS_URL: "http://localhost:5001/api/buyer/orderProducts"
}

// GET ORDERS FOR SELLERS
router.get("/orderProducts", async (request, response) => {
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        })
        const userId = user.data.response.id;
        const userRole = user.data.response.role;

        if (userRole == "seller") {
            var sellerProductsIds = []
            const sellerProducts = await axios.get(roads.SELLER_PRODUCTS_URL, {
                params: {
                    sellerId: userId
                }
            });
            sellerProducts.data.response.forEach((product) => {
                sellerProductsIds.push(product.id)
            });
            if (!sellerProducts) {
                return response.status(404).json({
                    "response": "No products added to sells for current user"
                });
            }
            const sellerOrderProducts = await axios.get(roads.GET_SELLER_ORDERS_URL, {
                params: {
                    productsIds: sellerProductsIds
                }
            });
            console.log(sellerOrderProducts.data.response)

            return response.status(200).json({
                "response": sellerOrderProducts.data.response
            });
        } else if (userRole == "buyer") {
            const buyerOrders = await axios.get(roads.GET_BUYER_ORDERS_URL, {
                params: {
                    ownerId: userId
                }
            })
            return response.status(200).json({
                "response": buyerOrders.data.response
            });
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// MAKE AN ORDER
router.post("/orderProducts", async (request, response) => {
    try {
        if (!request.body.address1) {
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        const userAddressToUse = await axios.get(roads.GET_ONE_USER_ADDRESS_URL,
            {
                params: {
                    address1: request.body.address1
                },
                headers: {
                    'Authorization': request.headers.authorization
                }
            }
        );
        console.log("#########PRODUCT############")
        const userId = userAddressToUse.data.userId;
        const userRole = userAddressToUse.data.userRole;
        if (userRole == "buyer") {
            const productsInCart = await axios.get(roads.CART_URL, {
                params: {
                    userId: userId
                }
            });
            console.log("#########PRODUCT############")
            console.log(productsInCart.data.response)
            if (productsInCart.length == 0) {
                return response.status(404).json({
                    "response": "No product found in user cart"
                });
            }
            const stockUpdate = await axios.put(roads.UPDATE_PRODUCTS_STOCKS,
                productsInCart.data.response
            )
            const cartProductsToDelete = await axios.delete(roads.CART_URL,
                { data: productsInCart.data.response }
            )
            // console.log("#########PRODUCT############")
            // console.log(productsInCart.data.response)

            if (stockUpdate.status == 200 && cartProductsToDelete.status == 200) {
                const ordersProducts = await axios.post(roads.CREATE_ORDER_URL, {
                    cartProductsData: productsInCart.data.response,
                    userAddressId: userAddressToUse.data.response.id,
                    ownerId: userId
                });
                return response.status(ordersProducts.status).json({
                    "response": ordersProducts.data.response
                });
            }
            else {
                return response.status(400).json({
                    "response": "order cancelled"
                });
                //TODO ROLLBACK IF NECESSARY
            }
        } else {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;