const router = require("express").Router();
const axios = require('axios');

const roads = {
    // INVENTORY MICROSERVICE
    CATEGORIES_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productCategories`,
    // AUTHENTICATION MICROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
}

//GET CATEGORIES
router.get("/productCategories", async (request, response) => {
    try {
        await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const categories = await axios.get(roads.CATEGORIES_URL)
        return response.status(categories.status).json({
            "response": categories.data.response
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;