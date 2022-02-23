const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    CREATE_ACCOUNT_URL: "http://localhost:5002/api/register",
    LOGIN_ACCOUNT_URL: "http://localhost:5002/api/login",
    DISABLE_ACCOUNT_URL: "http://localhost:5002/api/disable",
    DEACTIVATE_ACCOUNT_URL: "http://localhost:5002/api/deactivate",
    // PRODUCT MICROSERVICE
    WITHDRAW_SELLER_PRODUCTS_URL: "http://localhost:5003/api/seller/products"
}

// LOGIN
router.post("/login", async (request, response) => {
    if (!request.body.email || !request.body.password) {
        return response.status(400).json({
            "response": "Bad json format"
        });
    }
    try {
        const userToLogin = await axios.post(roads.LOGIN_ACCOUNT_URL, {
            email: request.body.email,
            password: request.body.password,
        });
        if (userToLogin.status === 200) {
            return response.status(200).json({
                "response": userToLogin.data.response,
                "token": userToLogin.data.token
            });
        }
    } catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
        // if (error.response.status === 401) {
        //     return response.status(401).json({
        //         "response": error.response.statusText
        //     });
        // }
    }
});
// BUYER/SELLER ACCOUNT CREATION
router.post("/register", async (request, response) => {
    try {
        if (!request.body.email || !request.body.password || !request.body.firstName || !request.body.lastName || !request.body.birthDate || !request.body.userName) {
            return response.status(400).json({
                "response": "Bad json format"
            });
        }
        const userToRegister = await axios.post(roads.CREATE_ACCOUNT_URL, {
            email: request.body.email,
            password: request.body.password,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            userName: request.body.userName,
            birthDate: request.body.birthDate,
            role: request.body.role
        })

        if (userToRegister.status === 201) {
            return response.status(201).json({
                "response": userToRegister.data.response
            });
        }
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// ADMIN ROAD FOR ACCOUNT DISABLING //TODO DISABLE SELLERS PRODUCTS
router.put("/disable", async (request, response) => {
    try {
        if (!request.body.password || !request.query.email) {
            return response.status(400).json({
                "response": "Bad json format"
            });
        }
        if (!request.headers.authorization) {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
        const userEmailToDisable = request.query.email;
        const userPassword = request.body.password;

        const userDisabled = await axios.put(roads.DISABLE_ACCOUNT_URL + "?email=" + userEmailToDisable, {
            password: userPassword,
        }, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        return response.status(200).json({
            "response": userDisabled.data.response
        });
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// DISABLE USER WHO MAKE THE REQUEST
router.put("/deactivate", async (request, response) => {
    try {
        if (!request.headers.authorization) {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
        const deactivatedAccount = await axios.put(roads.DEACTIVATE_ACCOUNT_URL, null, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        console.log("deactivatedAccount",deactivatedAccount.data.response)
        const sellerId = deactivatedAccount.data.userId
        if (deactivatedAccount.data.userRole == "seller") {
            console.log(roads.WITHDRAW_SELLER_PRODUCTS_URL + "?sellerId=" + sellerId)
            const sellerProducts = await axios.put(roads.WITHDRAW_SELLER_PRODUCTS_URL + "?sellerId=" + sellerId)
            return response.status(200).json({
                "response": sellerProducts.data.response
            });
        } else {
            return response.status(200).json({
                "response": deactivatedAccount.data.response
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