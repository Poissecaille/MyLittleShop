const router = require("express").Router();
const Sequelize = require('sequelize');
const OrderProduct = require("../models/orderProduct");
const Op = Sequelize.Op

// GET ORDERED PRODUCTS FOR SELLERS
router.get("/seller/orderProducts", async (request, response) => {
    try {
        console.log("----------------TEST---------------")
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
        console.log("----------------TEST---------------")
        const orderProducts = await OrderProduct.findAll({
            where: {
                ownerId: request.query.ownerId
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


// CREATE ORDER
router.post("/orderProducts", async (request, response) => {
    try {
        var ordersProducts = [];
        request.body.cartProductsData.forEach(async (cartProduct) => {
            console.log(cartProduct)
            var orderProduct = new OrderProduct({
                ownerId: request.body.ownerId,
                productId: cartProduct.id,
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
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

module.exports = router;