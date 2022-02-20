const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    //GET_USER_DATA_URL: "http://localhost:5002/api/userData",
    CHECK_TOKEN_URL: "http://localhost:5002/api/checkToken",
    GET_ONE_USER_ADDRESSE_URL: "http://localhost:5002/api/userAddress",
    //PRODUCT MICROSERVICE
    CART_URL: "http://localhost:5003/api/cartProducts",
    SELLER_PRODUCTS_URL: "http://localhost:5003/api/seller/products",
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
        const userId = user.data.response.id;
        const userRole = user.data.response.role;
        if (userRole == "seller") {
            var sellerProductsIds = []
            const sellerProducts = await axios.get(roads.SELLER_PRODUCTS_URL, {
                params: {
                    sellerId: userId
                }
            });
            console.log("8888",sellerProducts.response)
            // const sellerOrderProducts = await axios.get(roads.GET_ORDERS_URL,{
            //     params:{
            //         productId:sellerProducts.data
            //     }
            // })
            

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
            const ordersProducts = await axios.post(roads.CREATE_ORDER_URL, {
                cartProductsData: productsInCart.data.response,
                userAddress: userAddressToUse.data.response,
                userId: userId
            });
            return response.status(200).json({
                "response": ordersProducts.data.response
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