const router = require("express").Router();
const axios = require('axios');

const roads = {
    // AUTHENTICATION MICROSERVICE
    CREATE_ACCOUNT_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/register`,
    LOGIN_ACCOUNT_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/login`,
    DISABLE_ACCOUNT_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/disable`,
    DEACTIVATE_ACCOUNT_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/deactivate`,
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    SYNC_ACCOUNT_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/syncAccount`,
    ADMIN_USER_ACCOUNTS_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/admin`,
    USER_ADDRESSES_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userAddresses`,
    // PRODUCT MICROSERVICE
    SELLER_PRODUCTS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/seller/products`,
    // ORDER MISCROSERVICE
    BUYER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/buyer/orderProducts`,
    SELLER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/seller/orderProducts`
}

//GET USER ROLE FOR DYNAMIC FRONT RENDERING
router.get("/userRole", async (request, response) => {
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userRole = user.data.response.role;
        return response.status(200).json({
            "response": userRole
        })
    }
    catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

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
                "token": userToLogin.data.token,
                "role": userToLogin.data.role
                //"expire": userToLogin.data.expire
            });
        }
    } catch (error) {
        console.log(error)
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
// BUYER ACCOUNT CREATION
router.post("/register", async (request, response) => {
    try {
        console.log(request.body)
        console.log("########################")
        if (!request.body.email || !request.body.password || !request.body.firstname || !request.body.lastname || !request.body.birthdate || !request.body.username) {
            return response.status(400).json({
                "response": "Bad json format"
            });
        }
        const userToRegister = await axios.post(roads.CREATE_ACCOUNT_URL, {
            email: request.body.email,
            password: request.body.password,
            firstname: request.body.firstname,
            lastname: request.body.lastname,
            username: request.body.username,
            birthdate: request.body.birthdate,
            role: "buyer"
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


// SELLER ACCOUNT CREATION BY ADMIN
router.post("/seller/register", async (request, response) => {

    try {
        if (!request.body.email || !request.body.password || !request.body.firstname || !request.body.lastname || !request.body.birthdate || !request.body.username) {
            return response.status(400).json({
                "response": "Bad json format"
            });
        }
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userRole = user.data.response.role

        if (userRole === "admin") {
            const userToRegister = await axios.post(roads.CREATE_ACCOUNT_URL, {
                email: request.body.email,
                password: request.body.password,
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                username: request.body.username,
                birthdate: request.body.birthdate,
                role: "seller"
            })

            if (userToRegister.status === 201) {
                return response.status(201).json({
                    "response": userToRegister.data.response
                });
            }
        }
        else {
            return response.status(401).json({ "response": "Unauthorized" });
        }
    } catch (error) {
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
        const userDisabled = await axios.put(roads.DISABLE_ACCOUNT_URL + "?email=" + userEmailToDisable, {
            password: request.body.password,
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        return response.status(200).json({
            "response": userDisabled.data.response
        });
    } catch (error) {
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
        if (!request.body.password) {
            return response.status(400).json({
                "response": "Bad request format"
            });
        }
        const deactivatedAccount = await axios.put(roads.DEACTIVATE_ACCOUNT_URL, {
            password: request.body.password
        }, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const sellerId = deactivatedAccount.data.userId
        if (deactivatedAccount.data.userRole == "seller") {
            const sellerProducts = await axios.put(roads.SELLER_PRODUCTS_URL + "?sellerId=" + sellerId)
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

//SYNC ACCOUNT WITH FRONT STORAGE
router.get("/syncAccount", async (request, response) => {
    try {
        const userData = await axios.get(roads.SYNC_ACCOUNT_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        })
        return response.status(200).json({
            "response": userData.data.response
        });
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//ADMIN CONSOLE ROUTE
router.get("/admin", async (request, response) => {
    // const page = request.query.page;
    const limit = request.query.limit;
    const offset = request.query.offset;
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    const user = await axios.get(roads.CHECK_TOKEN_URL, {
        headers: {
            'Authorization': request.headers.authorization
        }
    });
    const userRole = user.data.response.role;
    if (userRole === "admin") {
        var sellerIds = []
        var buyerIds = []
        const usersToDisplay = await axios.get(roads.ADMIN_USER_ACCOUNTS_URL, {
            params: {
                limit: limit,
                offset: offset
            }
        });
        for (let i = 0; i < usersToDisplay.response.data.response.length; i++) {
            if (usersToDisplay.response.data.response[i].role === "seller") {
                sellerIds.push(usersToDisplay.response.data.response[i].id)
                usersToDisplay.response.data.response[i].products = []
            } else if (usersToDisplay.response.data.response[i].role === "buyer") {
                buyerIds.push(usersToDisplay.response.data.response[i].id)
                usersToDisplay.response.data.response[i].addresses = []
                usersToDisplay.response.data.response[i].orders = []

            }
        }
        const buyerAddresses = await axios.get(roads.USER_ADDRESSES_URL, {
            params: {
                userIds: buyerIds
            }
        });

        const buyerOrders = await axios.get(roads.BUYER_ORDERS_URL, {
            params: {
                userIds: buyerIds
            }
        });

        const sellerProducts = await axios.get(roads.SELLER_PRODUCTS_URL, {
            params: {
                sellerIds: sellerIds
            }
        });

        //const sellerOrders = await axios.get(roads.)

        for (let i = 0; i < buyerAddresses.response.data.response.length; i++) {
            for (let j = 0; j < usersToDisplay.response.data.response.length; j++) {
                if (buyerAddresses.response.data.response[i].userId === usersToDisplay.response.data.response[j].id) {
                    usersToDisplay.response.data.response[j].addresses.push(buyerAddresses.response.data.response[i])
                }
            }
            for (let k = 0; k < buyerOrders.response.data.response.length; k++) {
                if (buyerOrders.response.data.response[k].ownerId === usersToDisplay.response.data.response[j].id) {
                    usersToDisplay.response.data.response[i].orders.push(buyerOrders.response.data.response[k])
                }
            }

            return response.status(200).json({
                "response": usersToDisplay.data.response
            });
        }

    } else {
        return response.status(401).json({
            "response": "Unauthorized"
        });
    }
});


module.exports = router;