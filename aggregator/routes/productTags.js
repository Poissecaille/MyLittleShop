const router = require("express").Router();
const axios = require('axios');
var logger = require('../settings/logger');
const roads = {
    // INVENTORY MICROSERVICE
    TAGS_NAMES_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productTagsNames`,
    // AUTHENTICATION MICROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
}

//GET TAGS
router.get("/productTags", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const tags = await axios.get(roads.TAGS_NAMES_URL)
        logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${tags.data.response}`)
        return response.status(tags.status).json({
            "response": tags.data.response
        });
    } catch (error) {
        logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response: ${error.response.data.response}`)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;