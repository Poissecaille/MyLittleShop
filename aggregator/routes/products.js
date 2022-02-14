const router = require("express").Router();
const axios = require('axios');

const roads = {
    // PRODUCT MICROSERVICE
    SEARCH_PRODUCTS_URL: "http://localhost:5003/api/products",
    SEARCH_USERS_URL: "http://localhost:5002/api/sellers"
}

router.get("/products", async (request, response) => {
    if (!request.query.userEmail) {
        return response.status(400).json({
            "response": "Bad request format",
        });
    }
    var sellersIds = []
    const sellers = await axios.get(roads.SEARCH_USERS_URL, {
        params: {
            userEmail: request.query.userEmail
        },
        headers: {
            'Authorization': request.headers.authorization
        }
    })
    sellers.data.response.forEach((seller) => {
        sellersIds.push(seller.id)
    });
    console.log("######")
    console.log(sellersIds)
    const products = await axios.get(roads.SEARCH_PRODUCTS_URL, {
        params: {
            sellersIds
        }
    });
    return response.status(200).json({
        "response": products.data.response,
        "numberOfProducts": products.data.rows
    });
});

module.exports = router;