const router = require("express").Router();
const Sequelize = require('sequelize');
const OrderProduct = require("../models/orderProduct");
const Order = require("../models/Order");
const Op = Sequelize.Op


// CREATE ORDER
router.post("/orderProduct", async (request, response) => {
    try {
        var order;
        var ordersProducts = [];
        const existantOrder = await Order.findOne({
            where: {
                ownerId: request.body.userId
            }
        })
        if (!existantOrder) {
            const order = await new Order({
                ownerId: request.body.userId,
                userAddress: request.body.userAddress.id
            }).save();
            console.log(order)
        } else {
            order = existantOrder
        }
        console.log(request.body.cartProductsData)
        for (var product of request.body.cartProductsData) {
            var existantOrderProduct = await OrderProduct.findOne({
                where: {
                    productId: product.id,
                    quantity: product.quantity,
                    orderId: order.id
                }
            });
            if (!existantOrderProduct) {
                var orderProduct = await new OrderProduct({
                    productId: product.id,
                    quantity: product.quantity,
                    orderId: order.id
                }).save();
                console.log("ITERATION *****")
                ordersProducts.push(orderProduct);
            }
        }
        return response.status(200).json({
            "response": ordersProducts
        });
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;