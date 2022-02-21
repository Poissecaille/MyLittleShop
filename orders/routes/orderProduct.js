const router = require("express").Router();
const Sequelize = require('sequelize');
const OrderProduct = require("../models/orderProduct");
const Order = require("../models/order");
const Op = Sequelize.Op

// GET ORDERS BY PRODUCT ID FOR SELLER ORDERS
router.get("/orderProducts", async (request, response) => {
    try {
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
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});



// CREATE ORDER
router.post("/orderProduct", async (request, response) => {
    try {
        //var order;
        var ordersProducts = [];
        console.log(request.body.userId)
        // const existantOrder = await Order.findOne({
        //     where: {
        //         ownerId: request.body.userId,
        //         createdAt
        //     }
        // })
        // if (!existantOrder) {
        //     order = new Order({
        //         ownerId: request.body.userId,
        //         userAddress: request.body.userAddress.id
        //     });
        //     await order.save();
        //     console.log(order)
        // } else {
        //     order = existantOrder
        // }
        request.body.cartProductsData.forEach(async (cartProduct) => {

            console.log(cartProduct)
            var existantOrderProduct = await OrderProduct.findOne({
                where: {
                    productId: cartProduct.id,
                    quantity: cartProduct.quantity,
                    shipped: "preparation"
                    //orderId: order.id
                }
            });
            if (!existantOrderProduct) {
                var orderProduct = new OrderProduct({
                    productId: cartProduct.productId,
                    quantity: cartProduct.quantity,
                });
                await orderProduct.save()
                console.log("ITERATION *****")
                ordersProducts.push(orderProduct);
                console.log(ordersProducts)
            }
        });
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