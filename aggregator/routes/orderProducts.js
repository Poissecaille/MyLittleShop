const router = require("express").Router();
const axios = require('axios');

const roads = {
    // AUTHENTICATION MICROSERVICE
    CHECK_TOKEN_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/checkToken`,
    GET_ONE_USER_ADDRESS_URL: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/userAddress`,
    GET_DELIVERY_USER_ADDRESS: `http://authentication:${process.env.APP_AUTHENTICATION_PORT}/api/deliveryUserAddress`,
    //INVENTORY MICROSERVICE
    CART_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/cartProducts`,
    BUYER_PRODUCT_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/buyer/products`,
    SELLER_PRODUCTS_URL: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/seller/products`,
    UPDATE_PRODUCTS_STOCKS: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/products`,
    SYNC_ORDERED_PRODUCT: `http://inventory:${process.env.APP_INVENTORY_PORT}/api/orderedProduct`,
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
        }
        else {
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
        // if (process.env.NODE_ENV === "test") {
        //     if (!request.body.mailRecipient || request.body.mailSubject || request.body.mailContent) {
        //         return response.status(400).json({
        //             "response": "Bad json format"
        //         });
        //     }
        // }
        console.log('CHECKING')
        console.log(request.headers)
        if (!request.body.productName || !request.body.ownerId || !request.body.addressName || !request.body.shipped || !request.body.shippingDate) {
           
            return response.status(400).json({
                "response": "Bad json format"
            });
        }
        const address = await axios.get(roads.GET_ONE_USER_ADDRESS_URL, {
            params: {
                address1: request.body.addressName
            }
        });
        const user = await axios.get(roads.CHECK_TOKEN_URL, {
            headers: {
                'Authorization': request.headers.authorization
            }
        })
        const userId = user.data.response.id
        const userRole = user.data.response.role
        console.log("userId:",userId, "userRole:", userRole)
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

//REFRESH ORDERS
router.get("/syncOrder", async (request, response) => {
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
            console.log(orders.data.response)
            if (orders.data.response.length === 0) {
                return response.status(200).json({
                    "response": orders.data.response
                });
            }

            // for (let i=0;i<orders.data.response.length;i++){
            //     const userDeliveryAddress = await axios.get(roads.GET_DELIVERY_USER_ADDRESS, {
            //             params: {
            //                 addressId: orders.data.response[i].addressId
            //             }
            //         });
            //         const productData = await axios.get(roads.SYNC_ORDERED_PRODUCT, {
            //             params: {
            //                 productId: orders.data.response[i].productId
            //             }
            //         }); 
            // }

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
            console.log("********************")
            console.log(userId)
            console.log(sellerProductsIds)
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
            console.log(sellerOrders.data.response)
            return response.status(200).json({
                "response": sellerOrders.data.response
            });
        }
    }
    catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
})

module.exports = router;