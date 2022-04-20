const router = require("express").Router();
const axios = require('axios');

const roads = {
    // INVENTORY MICROSERVICE
    TAGS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productTags`,
    // AUTHENTICATION MICROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
}

//GET TAGS
router.get("/productTags", async (request, response) => {
    try {
        await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const tags = await axios.get(roads.TAGS_URL)
        return response.status(tags.status).json({
            "response": tags.data.response
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;