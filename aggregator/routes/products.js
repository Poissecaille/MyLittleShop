const router = require("express").Router();
const axios = require('axios');

const roads = {
    // PRODUCT MICROSERVICE
    SEARCH_PRODUCTS_URL: "http://localhost:5003/api/products",
    //SEARCH_USERS_URL: 
}

router.get("/products", async (request, response) => {
    if (!request.query.sellerEmail || !request.query.lowerPrice || !request.query.higherPrice || !request.query.condition || !request.query.category || !request.query.name || !request.query.filter) {
        return response.status(400).json({
            "response": "Bad request format",
        });
    }
    const sellersId = await User
    //const sellers = await axios.get(roads.SEARCH_PRODUCTS_URL,{})

});

module.exports = router;