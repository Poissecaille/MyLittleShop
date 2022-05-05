const router = require("express").Router();
const axios = require('axios');
var logger = require('../settings/logger');
const roads = {
    //USER MICROSERVICE
    USER_ADDRESSES_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userAddresses`,
    USER_ADDRESS_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userAddress`,
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
}

// CONSULT ALL USER ADDRESSES
router.get("/userAddresses", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        const addresses = await axios.get(roads.USER_ADDRESSES_URL, {
            params: {
                userId: userId
            },
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${addresses.data.response}`)
        return response.status(addresses.status).json({
            "response": addresses.data.response
        });
    }
    catch (error) {
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
})

//CREATE A USER ADDRESS
router.post("/userAddress", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        if (!request.body.address1 || !request.body.address2 || !request.body.city || !request.body.region || !request.body.country || !request.body.postalCode) {
            logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: Bad json format`)
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        const newAddress = await axios.post(roads.USER_ADDRESS_URL, request.body, {
            headers: {
                'Authorization': request.headers.authorization
            },
        });
        logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${newAddress.data.response}`)
        return response.status(newAddress.status).json({
            "response": newAddress.data.response
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

//MODIFY A USER ADDRESS
router.put("/userAddress", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        if (!request.body.address1 || !request.body.address2 || request.body.postalCode.toString().length != 5) {
            logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: Bad json format`)
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        const userAddressToUpdate = await axios.put(roads.USER_ADDRESS_URL, request.body, {
            headers: {
                'Authorization': request.headers.authorization
            },
        }
        );
        logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${userAddressToUpdate.data.response}`)
        return response.status(userAddressToUpdate.status).json({
            "response": userAddressToUpdate.data.response
        });
    } catch (error) {
        logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response: ${error.response.data.response}`)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//DELETE A USER ADDRESS
router.delete("/userAddress", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        if (!request.body.address1 || !request.body.address2) {
            logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: Bad json format`)
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        const userAddressToDelete = await axios.delete(roads.USER_ADDRESS_URL, {
            headers: {
                'Authorization': request.headers.authorization
            },
            data: request.body
        });
        logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${userAddressToDelete.data.response}`)
        return response.status(userAddressToDelete.status).json({
            "response": userAddressToDelete.data.response
        });
    } catch (error) {
        logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response: ${error.response.data.response}`)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


module.exports = router;
