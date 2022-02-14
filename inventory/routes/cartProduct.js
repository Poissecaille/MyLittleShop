const router = require("express").Router();
const cartProduct = require("../models/cartProduct");
const Sequelize = require('sequelize');
const Product = require("../models/product");
const Op = Sequelize.Op

router.get("/cartProduct", async (request, response) => {
    if (!request.query.userId) {
        return response.status(400).json({
            "response": "Bad request format",
        });
    }
    const cartProducts = await cartProduct.findAll({
        where: {
            ownerId: request.query.userId
        }
    });
    return response.status(200).json({
        "response": cartProducts
    });

});

router.post("/cartProduct", async (request, response) => {
    if (!request.body.userId || !request.body.productName || !request.body.quantity) {
        return response.status(400).json({
            "response": "Bad request format",
        });
    }

    const availableProduct = await Product.findOne(
        {
            where: {
                name: request.body.productName,
                // availableQuantity: { [Op.gt]: 0 }
            }
        }
    );
    if (!availableProduct) {
        return response.status(404).json({
            "response": "Product not found"
        });
    }

    if (availableProduct.availableQuantity === 0 || availableProduct.availableQuantity < request.body.quantity) {
        return response.status(400).json({
            "response": "No product in stocks",
        });
    }

    const cartProductExistant = await cartProduct.findOne(
        {
            where: {
                ownerId: request.body.userId,
                productId: availableProduct.id,
            }
        }
    );

    if (!cartProductExistant) {
        const newCartProduct = new cartProduct({
            ownerId: request.body.userId,
            productId: availableProduct.id,
            quantity: request.body.quantity
        });
        await newCartProduct.save();
        return response.status(201).json({
            "response": "Product added to cart"
        });
    } else {
        return response.status(409).json({
            "response": "Product already in cart"
        });
    }
});

router.put("/cartProduct", async (request, response) => {
    console.log(request.body)
    var productsNames = []
    var productIds = []
    request.body.forEach((product) => {
        productsNames.push(product.productName)
    });
    try {
        const products = await cartProduct.findAll(
            {
                where: {
                    //[Op.Or]: [
                         ownerId: { [Op.like]: productsNames } 
                    //]
                }
            }
        )
        console.log(products)
    } catch (error) { console.log(error) }
    // if (!request.query.userId || !request.query.productName) {
    //     return response.status(400).json({
    //         "response": "Bad request format",
    //     });
    // }

    // const cartProductToUpdate = await cartProduct.fin

    // await cartProduct.update(
    //     {

    //     }
    // )
});

module.exports = router;