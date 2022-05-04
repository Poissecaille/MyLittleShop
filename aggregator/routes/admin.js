
const router = require("express").Router();
const axios = require('axios');


const roads = {
    // AUTHENTICATION MISCROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    ADMIN_USER_ACCOUNTS_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/admin/users`,
    USER_ADDRESSES_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userAddresses`,
    //ORDER MICROSERVICE
    BUYER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/buyer/orderProducts`,
    SELLER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/seller/orderProducts`,
    // INVENTORY MISCROSERVICE
    SELLER_PRODUCTS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/seller/products`,

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
        for (let i = 0; i < usersToDisplay.data.response.length; i++) {
            if (usersToDisplay.data.response[i].role === "seller") {
                sellerIds.push(usersToDisplay.data.response[i].id)
                usersToDisplay.data.response[i].products = []
                usersToDisplay.data.response[i].orders = []
            } else if (usersToDisplay.data.response[i].role === "buyer") {
                buyerIds.push(usersToDisplay.data.response[i].id)
                usersToDisplay.data.response[i].addresses = []
                usersToDisplay.data.response[i].orders = []
            }
        }
        const buyerAddresses = await axios.get(roads.USER_ADDRESSES_URL, {
            params: {
                userIds: buyerIds
            }
        });

        const buyerOrders = await axios.get(roads.BUYER_ORDERS_URL, {
            params: {
                buyerIds: buyerIds
            }
        });

        const sellerProducts = await axios.get(roads.SELLER_PRODUCTS_URL, {
            params: {
                sellerIds: sellerIds
            }
        });
        var sellerProductIds = []
        for (let i = 0; i < sellerProducts.data.response.length; i++) {
            sellerProductIds.push(sellerProducts.data.response[i].id)
        }
        const sellerOrders = await axios.get(roads.SELLER_ORDERS_URL, {
            params: {
                productsIds: sellerProductIds
            }
        })
        console.log("-------------------------------")
        console.log(buyerAddresses.data.response)
        console.log(buyerOrders.data.response)
        console.log(sellerOrders.data.response)
        console.log(usersToDisplay.data.response)
        console.log("-------------------------------")

        for (let i = 0; i < usersToDisplay.data.response.length; i++) {
            for (let j = 0; j < buyerAddresses.data.response.length; j++) {
                if (buyerAddresses.data.response[j].userId === usersToDisplay.data.response[i].id && usersToDisplay.data.response[i].role === "buyer") {
                    usersToDisplay.data.response[i].addresses.push(buyerAddresses.data.response[j])
                }
            }
            for (let k = 0; k < buyerOrders.data.response.length; k++) {
                if (buyerOrders.data.response[k].ownerId === usersToDisplay.data.response[i].id && usersToDisplay.data.response[i].role === "buyer") {
                    usersToDisplay.data.response[i].orders.push(buyerOrders.data.response[k])
                }
            }
            for (let l = 0; l < sellerProducts.data.response.length; l++) {
                if (sellerProducts.data.response[l].sellerId === usersToDisplay.data.response[i].id && usersToDisplay.data.response[i].role === "seller") {
                    usersToDisplay.data.response[i].products.push(sellerProducts.data.response[l])
                }
                for (let m = 0; m < sellerOrders.data.response.length; m++) {
                    if (sellerOrders.data.response[m].productId === sellerProducts.data.response[l].id && usersToDisplay.data.response[i].role === "seller") {
                        usersToDisplay.data.response[i].orders.push(sellerOrders.data.response[m])
                    }
                }

            }
            // for (let m = 0; m < sellerOrders.data.response.length; m++) {
            //     if(sellerOrders.data.response[m])
            // }

        }
        return response.status(200).json({
            "response": usersToDisplay.data.response
        });

    } else {
        return response.status(401).json({
            "response": "Unauthorized"
        });
    }
});

module.exports = router;