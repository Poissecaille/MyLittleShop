const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    CHECK_TOKEN_URL: "http://localhost:5002/api/checkToken",
    //PRODUCT MICROSERVICE
    CART_URL: "http://localhost:5003/api/cartProduct"

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
                userId: userId
            });
        }
    } catch (error) { console.log(error) }
});

module.exports = router;