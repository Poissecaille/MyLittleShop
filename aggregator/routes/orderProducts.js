const router = require("express").Router();
const axios = require('axios');
var logger = require('../settings/logger');

const roads = {
    // AUTHENTICATION MICROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    GET_ONE_USER_ADDRESS_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userAddress`,
    GET_DELIVERY_USER_ADDRESS: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/deliveryUserAddress`,
    GET_USER_DATA_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userData`,
    //INVENTORY MICROSERVICE
    CART_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/cartProducts`,
    BUYER_PRODUCT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/buyer/products`,
    SELLER_PRODUCTS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/seller/products`,
    UPDATE_PRODUCTS_STOCKS: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/products`,
    SYNC_ORDERED_PRODUCT: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/orderedProduct`,
    PRODUCTS_PER_CART: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/productsPerCart`,
    //ORDER MICROSERVICE
    CREATE_ORDER_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/orderProducts`,
    GET_SELLER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/seller/orderProducts`,
    GET_BUYER_ORDERS_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/buyer/orderProducts`,
    SELLER_UPDATE_ORDER_URL: `http://orders:${process.env.APP_ORDER_PORT}/api/seller/orderProduct`,
    //MAILER SERVICE
    DELIVERY_MAILER_URL: `http://mailer:${process.env.APP_MAILER_PORT}/api/delivery/mail`,
    ORDER_MAILER_URL: `http://mailer:${process.env.APP_MAILER_PORT}/api/order/mail`
}


// GET ORDERS FOR SELLERS AND BUYERS
router.get("/orderProducts", async (request, response) => {
    var loggerDate = new Date().toISOString()
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
                logger.error(`timestamp:${loggerDate}, 
                    headers:${request.headers}, 
                    url:${request.url}, 
                    method:${request.method}, 
                    body:${request.body},
                    query:${request.query},
                    response: No products added to sells for current user`)
                return response.status(404).json({
                    "response": "No products added to sells for current user"
                });
            }
            const sellerOrderProducts = await axios.get(roads.GET_SELLER_ORDERS_URL, {
                params: {
                    productsIds: sellerProductsIds
                }
            });
            
            logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${sellerOrderProducts.data.response}`)
            return response.status(200).json({
                "response": sellerOrderProducts.data.response
            });
        } else {
            const buyerOrders = await axios.get(roads.GET_BUYER_ORDERS_URL, {
                params: {
                    ownerId: userId
                }
            })
            logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${buyerOrders.data.response}`)
            return response.status(200).json({
                "response": buyerOrders.data.response
            });
        }
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

// MAKE AN ORDER
router.post("/orderProducts", async (request, response) => {
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
                logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: No product found in user cart`)
                return response.status(404).json({
                    "response": "No product found in user cart"
                });
            }

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
                if (ordersProducts.status == 201) {
                    const userData = await axios.get(roads.GET_USER_DATA_URL, {
                        params: {
                            userId: userId
                        }
                    })
                    var productIds = [];
                    for (let i = 0; i < productsInCart.data.response.length; i++) {
                        productIds.push(productsInCart.data.response[i].productId)
                    }
                    const productsData = await axios.get(roads.PRODUCTS_PER_CART, {
                        params: {
                            productIds: productIds
                        }
                    })


                    for (let i = 0; i < productsInCart.data.response.length; i++) {
                        for (let j = 0; j < productsData.data.response.length; j++) {
                            if (productsData.data.response[j].id === productsInCart.data.response[i].productId) {
                                productsInCart.data.response[i].product = productsData.data.response[j]
                            }
                        }
                    }
                    await axios.post(roads.ORDER_MAILER_URL, {
                        mailRecipient: userData.data.response.email,
                        usernameRecipient: userData.data.response.username,
                        mailSubject: "LITTLESHOP Your order has been saved!",
                        mailContent: JSON.stringify(productsInCart.data.response)
                    });
                }
                logger.info(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body}
                query:${request.query},
                response:${ordersProducts.data.response}`)
                return response.status(ordersProducts.status).json({
                    "response": ordersProducts.data.response
                });
            }
            else {
                logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: order cancelled`)
                return response.status(400).json({
                    "response": "order cancelled"
                });
            }
        }
        else {
            logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: Unauthorized`)
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
        logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response:${error.response.data.response}`)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//UPDATE DELIVERY STATUS FOR SELLERS
router.put("/orderProduct", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        if (!request.body.ownerId) {
            logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response: Bad json format`)
            return response.status(400).json({
                "response": "Bad json format"
            });
        }
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        })
        const userId = user.data.response.id
        const userRole = user.data.response.role

        if (userRole == "seller") {
            const orderProductOwner = await axios.get(roads.GET_USER_DATA_URL, {
                params: {
                    userId: request.body.ownerId
                }
            })
            
            const orderProductToUpdate = await axios.put(roads.SELLER_UPDATE_ORDER_URL, {
                ownerId: request.body.ownerId,
                productId: request.body.productId,
                addressId: request.body.addressId,
                newShipped: request.body.newShipped,
                oldShipped: request.body.oldShipped,
                created_at: request.body.created_at
            });
            if (orderProductToUpdate.status == 200 && request.body.newShipped === "shipped") {
                await axios.post(roads.DELIVERY_MAILER_URL, {
                    mailRecipient: orderProductOwner.data.response.email,
                    usernameRecipient: orderProductOwner.data.response.username,
                    mailSubject: "LITTLESHOP your delivery is on the way!",
                    mailContent: JSON.stringify({
                        "shippingDate": request.body.shippingDate,
                        "productName": request.body.productName,
                        "address": request.body.address,
                    })
                });
            }
            logger.info(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body}
                query:${request.query},
                response:${orderProductToUpdate.data.response}`)
            return response.status(orderProductToUpdate.status).json({
                "response": orderProductToUpdate.data.response
            });
        } else {
            logger.error(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body},
                query:${request.query},
                response: Unauthorized`)
            return response.status(401).json({
                "response": "Unauthorized"
            });
        }
    } catch (error) {
        logger.error(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body},
            query:${request.query},
            response:${error.response.data.response}`)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//REFRESH ORDERS
router.get("/syncOrder", async (request, response) => {
    var loggerDate = new Date().toISOString()
    try {
        var json = [];
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        });
        const userId = user.data.response.id
        const userRole = user.data.response.role
        if (userRole === "buyer") {
            const orders = await axios.get(roads.GET_BUYER_ORDERS_URL, {
                headers: {
                    'Authorization': request.headers.authorization
                },
                params: {
                    ownerId: userId
                }
            })
            
            if (orders.data.response.length === 0) {
                logger.info(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body}
                query:${request.query},
                response:${orders.data.response}`)
                return response.status(200).json({
                    "response": orders.data.response
                });
            }

            const deliveryAddressIds = [];
            const orderedProductIds = [];
            for (let i = 0; i < orders.data.response.length; i++) {
                deliveryAddressIds.push(orders.data.response[i].addressId)
                orderedProductIds.push(orders.data.response[i].productId)
            }
            const userDeliveryAddress = await axios.get(roads.GET_DELIVERY_USER_ADDRESS, {
                params: {
                    addressIds: deliveryAddressIds
                }
            });
            const productData = await axios.get(roads.SYNC_ORDERED_PRODUCT, {
                params: {
                    productIds: orderedProductIds
                }
            });
            for (let i = 0; i < orders.data.response.length; i++) {
                var dict = {}
                for (let j = 0; j < userDeliveryAddress.data.response.length; j++) {
                    if (userDeliveryAddress.data.response[j].id == orders.data.response[i].addressId) {
                        dict.address = userDeliveryAddress.data.response[j]
                    }
                    for (let k = 0; k < productData.data.response.length; k++) {
                        if (productData.data.response[k].id === orders.data.response[i].productId) {
                            productData.data.response[k].quantity = orders.data.response[i].quantity
                            dict.cart = [productData.data.response[k]]
                            dict.cart[0].productName = dict.cart[0].name
                            dict.cart[0].productId = dict.cart[0].id
                            delete dict.cart[0].name
                            dict.cart[0].shipped = orders.data.response[i].shipped
                            dict.cart[0].shippingDate = orders.data.response[i].shippingDate
                        }
                    }
                }
                json.push(dict)
            }
            logger.info(`timestamp:${loggerDate}, 
                headers:${request.headers}, 
                url:${request.url}, 
                method:${request.method}, 
                body:${request.body}
                query:${request.query},
                response:${json}`)
            return response.status(200).json({
                "response": json
            });
        } else if (userRole === "seller") {
            var sellerProductsIds = [];
            const sellerProducts = await axios.get(roads.SELLER_PRODUCTS_URL, {
                params: {
                    sellerId: userId
                }
            })
            for (let i = 0; i < sellerProducts.data.response.length; i++) {
                sellerProductsIds.push(sellerProducts.data.response[i].id)
            }

            const sellerOrders = await axios.get(roads.GET_SELLER_ORDERS_URL, {
                params: {
                    productsIds: sellerProductsIds
                }
            });
            var deliveryAddressIds = []
            for (let i = 0; i < sellerOrders.data.response.length; i++) {
                deliveryAddressIds.push(sellerOrders.data.response[i].addressId)
            }
            const userDeliveryAddresses = await axios.get(roads.GET_DELIVERY_USER_ADDRESS, {
                params: {
                    addressIds: deliveryAddressIds
                }
            });
            for (let i = 0; i < sellerOrders.data.response.length; i++) {
                if (!sellerOrders.data.response[i].cart) {
                    sellerOrders.data.response[i].cart = []
                }
                if (!sellerOrders.data.response[i].address) {
                    sellerOrders.data.response[i].address = {}
                }
                for (let j = 0; j < sellerProducts.data.response.length; j++) {
                    if (sellerOrders.data.response[i].productId === sellerProducts.data.response[j].id) {
                        sellerOrders.data.response[i].cart.push(sellerProducts.data.response[j])
                        sellerOrders.data.response[i].cart[0].created_at = sellerOrders.data.response[i].created_at
                        sellerOrders.data.response[i].cart[0].updated_at = sellerOrders.data.response[i].updated_at
                        sellerOrders.data.response[i].cart[0].shipped = sellerOrders.data.response[i].shipped
                        sellerOrders.data.response[i].cart[0].shippingDate = sellerOrders.data.response[i].shippingDate
                        sellerOrders.data.response[i].cart[0].quantity = sellerOrders.data.response[i].quantity
                        sellerOrders.data.response[i].cart[0].productName = sellerOrders.data.response[i].cart[0].name
                    }
                }
                for (let k = 0; k < userDeliveryAddresses.data.response.length; k++) {
                    if (sellerOrders.data.response[i].addressId === userDeliveryAddresses.data.response[k].id) {
                        //sellerOrders.data.response[i].address.push(userDeliveryAddresses.data.response[k])
                        Object.keys(userDeliveryAddresses.data.response[k]).forEach(key => sellerOrders.data.response[i].address[key] = userDeliveryAddresses.data.response[k][key]);

                    }

                }
            }
            logger.info(`timestamp:${loggerDate}, 
            headers:${request.headers}, 
            url:${request.url}, 
            method:${request.method}, 
            body:${request.body}
            query:${request.query},
            response:${sellerOrders.data.response}`)
            return response.status(200).json({
                "response": sellerOrders.data.response
            });
        }
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

module.exports = router;