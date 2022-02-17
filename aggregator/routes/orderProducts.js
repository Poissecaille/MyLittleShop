const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    CHECK_TOKEN_URL: "http://localhost:5002/api/checkToken",
    //PRODUCT MICROSERVICE
    CART_URL: "http://localhost:5003/api/cartProduct",
    GET_PRODUCT_FROM_ID_URL: "http://localhost:5003/api/order/products"
}

// MAKE AN ORDER
router.post("/order", async (request, response) => {
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole == "buyer") {
            const productsInCart = await axios.get(roads.CART_URL, {
                params: {
                    userId: userId
                }
            });
            console.log(productsInCart.data.response)

            var productIds = []
            productsInCart.data.response.forEach((product) => {
                //productIds.push((product.productId, product.quantity))
                productIds.push(product.productId)
            });
            const products = await axios.get(roads.GET_PRODUCT_FROM_ID_URL, {
                params: {
                    productId: productIds
                }
            });
            console.log(products.data.response)
            var orderValue = 0;

            for (let pCart in productsInCart.data.response) {
                for (let p in products.data.response) {
                    if (pCart.productId == p.id) {
                        var orderProduct = await axios.post()
                        // orderProduct.ownerId=pCart.ownerId
                        // orderProduct.productId=pCart.productId
                        // orderProduct.quantity
                    }
                    break
                }
            }
        }
    } catch (error) { console.log(error) }
});

module.exports = router;