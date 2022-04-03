const router = require("express").Router();
const axios = require('axios');

const roads = {
    // USER MICROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    GET_ONE_USER_ADDRESS_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userAddress`,
    //INVENTORY MICROSERVICE
    CART_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/cartProducts`,
    BUYER_PRODUCT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/buyer/products`,
    SELLER_PRODUCTS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/seller/products`,
    UPDATE_PRODUCTS_STOCKS: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/products`,
    //ORDER MICROSERVICE
    CREATE_ORDER_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/orderProducts`,
    GET_SELLER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/seller/orderProducts`,
    GET_BUYER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/buyer/orderProducts`,
    //MAILER SERVICE
    MAILER_URL: `http://mailer:${process.env.APP_MAILER_PORT}/api/mail`
}

// GET ORDERS FOR SELLERS
router.get("/orderProducts", async (request, response) => {
    try {
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        })
        const userId = user.data.response.id;
        const userRole = user.data.response.role;

        if (userRole == "seller") {
            var sellerProductsIds = []
            const sellerProducts = await axios.get(roads.SELLER_PRODUCTS_URL, {
                params: {
                    sellerId: userId
                }
            });
            sellerProducts.data.response.forEach((product) => {
                sellerProductsIds.push(product.id)
            });
            if (!sellerProducts) {
                return response.status(404).json({
                    "response": "No products added to sells for current user"
                });
            }
            const sellerOrderProducts = await axios.get(roads.GET_SELLER_ORDERS_URL, {
                params: {
                    productsIds: sellerProductsIds
                }
            });
            console.log(sellerOrderProducts.data.response)

            return response.status(200).json({
                "response": sellerOrderProducts.data.response
            });
        } else {
            const buyerOrders = await axios.get(roads.GET_BUYER_ORDERS_URL, {
                params: {
                    ownerId: userId
                }
            })
            return response.status(200).json({
                "response": buyerOrders.data.response
            });
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// MAKE AN ORDER
router.post("/orderProducts", async (request, response) => {
    try {
        if (process.env.NODE_ENV === "test") {
            if (!request.body.mailRecipient || request.body.mailSubject || request.body.mailContent) {
                return response.status(400).json({
                    "response": "Bad json format"
                });
            }
        }
        if (!request.body.address1 || !request.body.address2) {
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        const userAddressToUse = await axios.get(roads.GET_ONE_USER_ADDRESS_URL,
            {
                params: {
                    address1: request.body.address1,
                    address2: request.body.address2
                },
                headers: {
                    'Authorization': request.headers.authorization
                }
            }
        );
        const userId = userAddressToUse.data.userId;
        const userRole = userAddressToUse.data.userRole;
        if (userRole == "buyer") {
            const productsInCart = await axios.get(roads.CART_URL, {
                params: {
                    userId: userId
                }
            });
            if (productsInCart.data.response.length == 0) {
                return response.status(404).json({
                    "response": "No product found in user cart"
                });
            }
            console.log("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOLOLOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")

            const stockUpdate = await axios.put(roads.UPDATE_PRODUCTS_STOCKS,
                productsInCart.data.response
            )
            const cartProductsToDelete = await axios.delete(roads.CART_URL,
                { data: productsInCart.data.response }
            )
            // console.log("#########PRODUCT############")
            // console.log(productsInCart.data.response)

            if (stockUpdate.status == 200 && cartProductsToDelete.status == 200) {
                const ordersProducts = await axios.post(roads.CREATE_ORDER_URL, {
                    cartProductsData: productsInCart.data.response,
                    userAddressId: userAddressToUse.data.response.id,
                    ownerId: userId
                });
                if (ordersProducts.status == 200) {
                    await axios.post(roads.MAILER_URL, {
                        mailRecipient: request.body.mailRecipient,
                        mailSubject: request.body.mailSubject,
                        mailContent: request.body.mailContent
                    });
                }
                return response.status(ordersProducts.status).json({
                    "response": ordersProducts.data.response
                });
            }
            else {
                return response.status(400).json({
                    "response": "order cancelled"
                });
                //TODO ROLLBACK IF NECESSARY
            }
        } else {
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//UPDATE DELIVERY STATUS FOR SELLERS
router.put("/orderProduct", async (request, response) => {
    try {
        if (process.env.NODE_ENV === "development") {
            if (!request.body.mailRecipient || request.body.mailSubject || request.body.mailContent) {
                return response.status(400).json({
                    "response": "Bad json format"
                });
            }
        }
        if (!request.body.productName || !request.body.ownerId || !request.body.addressName || !request.body.shipped || !request.body.shippingDate) {
            if (request.body.shipped !== "shipped" && request.body.shipped !== "delivred") {
                return response.status(400).json({
                    "response": "Bad json format"
                });
            }
            if (request.body.shippingDate < Date.parse(new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' '))) {
                return response.status(400).json({
                    "response": "Bad json format"
                });
            }
            return response.status(400).json({
                "response": "Bad json format"
            });
        }
        const address = await axios.get(roads.GET_ONE_USER_ADDRESS_URL, {
            params: {
                address1: request.body.addressName
            }
        });
        // const user = await axios.get(roads.CHECK_TOKEN_URL, {
        //     headers: {
        //         'Authorization': request.headers.authorization
        //     }
        // })
        const userId = address.data.id;
        const userRole = address.data.role;
        if (userRole == "seller") {
            const sellerProduct = await axios.get(roads.SELLER_PRODUCTS_URL, {
                params: {
                    sellerId: userId,
                    productName: request.body.productName
                }
            });
            if (!sellerProduct) {
                return response.status(404).json({
                    "response": "No products added to sells for current user"
                });
            }
            const orderProductToUpdate = await axios.put(roads.SELLER_PRODUCTS_URL, {
                ownerId: userId,
                productId: sellerProduct.data.response.id,
                addressId: address.data.response.id
            });
            //TODO MAILER
            if (orderProductToUpdate.status == 200) {
                await axios.post(roads.MAILER_URL, {
                    mailRecipient: request.body.mailRecipient,
                    mailSubject: request.body.mailSubject,
                    mailContent: request.body.mailContent
                });

            }
            return response.status(orderProductToUpdate.status).json({
                "response": orderProductToUpdate.data.response
            });
        } else {
            return response.status(401).json({
                "response": "Unauthorized"
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