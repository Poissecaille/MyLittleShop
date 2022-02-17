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
    try {
        const availableProduct = await Product.findOne(
            {
                where: {
                    name: request.body.productName,
                    availableQuantity: { [Op.gt]: 0 }
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

    } catch (error) {
        console.log(error)
    }
});

router.put("/cartProduct", async (request, response) => {
    if (request.body.quantity === 0) {
        return response.status(400).json({
            "response": "quantity can't be equal to 0"
        });
    }
    if (!request.body.productName || !request.body.userId || !request.body.quantity) {
        return response.status(400).json({
            "response": "bad json format"
        });

    }
    try {
        const product = await Product.findOne({
            where: {
                name: request.body.productName
            }
        });
        console.log("###", product.id)
        const cartProductToUpdate = await cartProduct.findOne(
            {
                where: {
                    ownerId: request.body.userId,
                    productId: product.id
                }
            }
        )

        if (!cartProductToUpdate) {
            return response.status(404).json({
                "response": "Item not found in cart",
            });
        }

        cartProductToUpdate.set({
            quantity: request.body.quantity,
            productName: request.body.productName
        })
        await cartProductToUpdate.save();
        return response.status(200).json({
            "response": cartProductToUpdate
        });

    } catch (error) { console.log(error) }
});

router.delete("/cartProduct", async (request, response) => {
    if (!request.body.productName || !request.body.userId) {
        return response.status(400).json({
            "response": "bad json format"
        });
    }
    const product = await Product.findOne({
        where: {
            name: request.body.productName
        }
    });
    if (!product) {
        return response.status(404).json({
            "response": "product not found"
        })
    }
    const cartProductToDelete = await cartProduct.findOne({
        where: {
            ownerId: request.body.userId,
            productId: product.id
        }
    });
    if (!cartProductToDelete) {
        return response.status(404).json({
            "response": "product not found"
        })
    }
    await cartProductToDelete.destroy();
    return response.status(200).json({
        "response": "product deleted from cart"
    });
});

module.exports = router;