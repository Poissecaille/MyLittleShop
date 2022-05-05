const router = require("express").Router();
const Sequelize = require('sequelize');
const OrderProduct = require("../models/orderProduct");
const Op = Sequelize.Op
var logger = require('../settings/logger');

// GET ORDERED PRODUCTS FOR SELLERS
router.get("/seller/orderProducts", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, query:${request.query}`)
        const orderProducts = await OrderProduct.findAll({
            where: {
                productId: {
                    [Op.in]: request.query.productsIds
                }
            }
        })
        return response.status(200).json({
            "response": orderProducts
        });
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// GET ORDERED PRODUCTS FOR BUYERS
router.get("/buyer/orderProducts", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, query:${request.query}`)
        const orderProducts = await OrderProduct.findAll({
            where: {
                ownerId: request.query.ownerId ? request.query.ownerId : { [Op.in]: request.query.buyerIds },
                productId: request.query.productId !== undefined ? request.query.productId : { [Op.ne]: null },
                shipped: request.query.orderStatus !== undefined ? request.query.orderStatus : { [Op.ne]: null }
            }
        });
        return response.status(200).json({
            "response": orderProducts
        });
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


// CREATE ORDER
router.post("/orderProducts", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        var ordersProducts = [];
        request.body.cartProductsData.forEach(async (cartProduct) => {
            console.log(cartProduct)
            var orderProduct = new OrderProduct({
                ownerId: request.body.ownerId,
                productId: cartProduct.productId,
                addressId: request.body.userAddressId,
                quantity: cartProduct.quantity
            })
            await orderProduct.save()
            console.log("ITERATION *****")
            ordersProducts.push(orderProduct);
            console.log(ordersProducts)
        });
        return response.status(201).json({
            "response": "Order created"
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//DELIVERY UPDATE FOR SELLERS
router.put("/seller/orderProduct", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        const orderToUpdate = await OrderProduct.findOne({
            where: {
                ownerId: request.body.ownerId,
                productId: request.body.productId,
                addressId: request.body.addressId,
                shipped: request.body.oldShipped,
                created_at: request.body.created_at
            }
        });
        if (!orderToUpdate) {
            return response.status(404).json({
                "response": "Order not found"
            });
        }
        await orderToUpdate.update({
            shipped: request.body.newShipped,

        });
        return response.status(200).json({
            "response": orderToUpdate
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;