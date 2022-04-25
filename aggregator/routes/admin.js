
const router = require("express").Router();
const axios = require('axios');


const roads = {
    ADMIN_USER_ACCOUNTS_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/admin`,
}

//ADMIN CONSOLE ROUTE
router.get("/admin", async (request, response) => {
    const limit = request.query.limit;
    const offset = request.query.offset;
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