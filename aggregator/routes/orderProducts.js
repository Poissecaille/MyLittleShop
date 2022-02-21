const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    CHECK_TOKEN_URL: "http://localhost:5002/api/checkToken",
    GET_ONE_USER_ADDRESSE_URL: "http://localhost:5002/api/userAddress",
    //PRODUCT MICROSERVICE
    CART_URL: "http://localhost:5003/api/cartProducts",
    SELLER_PRODUCTS_URL: "http://localhost:5003/api/seller/products",
    UPDATE_PRODUCTS_STOCKS: "http://localhost:5003/api/products",
    //ORDER MICROSERVICE
    CREATE_ORDER_URL: "http://localhost:5001/api/orderProduct",
    GET_ORDERS_URL: "http://localhost:5001/api/orderProducts"

}

// GET ORDERS FOR SELLERS
router.get("/orders", async (request, response) => {
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        })
        console.log("ok")
        const userId = user.data.response.id;
        const userRole = user.data.response.role;
        if (userRole == "seller") {
            var sellerProductsIds = []
            const sellerProducts = await axios.get(roads.SELLER_PRODUCTS_URL, {
                params: {
                    sellerId: userId
                }
            });
            console.log("ok")

            sellerProducts.data.response.forEach((product) => {
                sellerProductsIds.push(product.id)
            });
            if (!sellerProducts) {
                return response.status(404).json({
                    "response": "No products added to sells for current user"
                });
            }
            console.log(userId)
            console.log(sellerProducts.data.response)
            const sellerOrderProducts = await axios.get(roads.GET_ORDERS_URL, {
                params: {
                    productsIds: sellerProductsIds
                }
            });
            console.log(sellerOrderProducts.data.response)

            return response.status(200).json({
                "response": sellerOrderProducts.data.response
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
router.post("/order", async (request, response) => {
    if (!request.body.userAddressName) {
        return response.status(400).json({
            "response": "Bad json format",
        });
    }
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        })
        const userId = user.data.response.id;
        const userRole = user.data.response.role;
        const userAddressToUse = await axios.get(roads.GET_ONE_USER_ADDRESSE_URL,
            {
                params: {
                    address1: request.body.userAddressName,
                    userId: userId
                },
                headers: {
                    'Authorization': request.headers.authorization
                }
            }
        );
        if (userRole == "buyer") {
            const productsInCart = await axios.get(roads.CART_URL, {
                params: {
                    userId: userId
                }
            });
            console.log(userId)
            console.log(userRole)
            console.log(productsInCart.data.response)
            console.log(userAddressToUse.data.response)

            const stockUpdate = await axios.put(roads.UPDATE_PRODUCTS_STOCKS,
                productsInCart.data.response
            )
            console.log(productsInCart.data.response)
            console.log("STOCK UPDATED!!!!")
            const cartProductsToDelete = await axios.delete(roads.CART_URL,
                { data: productsInCart.data.response }
            )

            if (stockUpdate.status == 200 && cartProductsToDelete.status == 200) {
                const ordersProducts = await axios.post(roads.CREATE_ORDER_URL, {
                    cartProductsData: productsInCart.data.response,
                    userAddress: userAddressToUse.data.response,
                    userId: userId
                });
                return response.status(200).json({
                    "response": ordersProducts.data.response
                });
            }
            else {
                return response.status(400).json({
                    "response": "order cancelled"
                });
                //TODO ROLLBACK IF NECESSARY
            }
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;