const router = require("express").Router();
const Sequelize = require('sequelize');
const OrderProduct = require("../models/orderProduct");
const Op = Sequelize.Op


// CREATE ORDER
router.post("/orderProduct", async (request, response) => {
    try {
        const newOrderProduct = new OrderProduct({
            ownerId: request.body.ownerId,
            productId: request.body.productId,
            quantity: request.body.quantity,
        });
        await newOrderProduct.save();
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;