const router = require("express").Router();
const cartProduct = require("../models/cartProduct");
const Sequelize = require('sequelize');
const Product = require("../models/product");
const Op = Sequelize.Op

router.get("/cartProducts", async (request, response) => {
    try {
        //var productIds = [];
        if (!request.query.userId) {
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        const cartProducts = await cartProduct.findAll({
            where: {
                ownerId: request.query.userId
            }
        });

        // cartProducts.forEach((cartProduct) => {
        //     productIds.push(cartProduct.productId)
        // });

        // const products = await Product.findAll({
        //     where: {
        //         id: { [Op.in]: productIds }
        //     }
        // })
        // for (let i = 0; i < products.length; i++) {
        //     if (products[i].dataValues.id === cartProducts[i].dataValues.productId) {
        //         cartProducts[i].dataValues.productName = products[i].dataValues.name
        //     }
        // }
        return response.status(200).json({
            "response": cartProducts
        });
    } catch (error) {
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});



router.post("/cartProduct", async (request, response) => {
    try {
        const availableProduct = await Product.findOne(
            {
                where: {
                    name: request.body.productName,
                    sellerId: request.body.sellerId,
                    availableQuantity: { [Op.gte]: request.body.quantity },
                    onSale: true
                }
            }
        );
        if (!availableProduct) {
            return response.status(404).json({
                "response": "Product not found or not in stock"
            });
        }
        const productAlreadyInCart = await cartProduct.findOne({
            where: {
                [Op.and]: [
                    {
                        productId: {
                            [Op.eq]: availableProduct.id
                        }
                    }, {
                        ownerId: {
                            [Op.eq]: request.body.userId
                        }
                    }
                ]
            }
        });
        if (!productAlreadyInCart) {
            const newCartProduct = new cartProduct({
                productId: availableProduct.id,
                quantity: request.body.quantity,
                ownerId: request.body.userId
            });
            await newCartProduct.save();
            await availableProduct.update({
                availableQuantity: availableProduct.availableQuantity - newCartProduct.quantity
            })
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
        if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(409).json({
                "response": "Product already in cart"
            });
        }
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

router.put("/cartProduct", async (request, response) => {
    try {
        const availableProduct = await Product.findOne({
            where: {
                name: request.body.productName,
                sellerId: request.body.sellerId,
                availableQuantity: { [Op.gte]: request.body.quantity }
            }
        });
        if (!availableProduct) {
            return response.status(404).json({
                "response": "Product not found or not in stock"
            });
        }
        // if (availableProduct.availableQuantity < request.body.quantity) {
        //     return response.status(404).json({
        //         "response": "Not enough products in stock"
        //     });
        // }
        const productInCart = await cartProduct.findOne({
            where: {
                ownerId: request.body.userId,
                productId: availableProduct.id
            }
        });
        if (!productInCart) {
            return response.status(404).json({
                "response": "product not found in current user cart"
            });
        }
        await productInCart.update({
            quantity: request.body.quantity
        })
        await availableProduct.update({
            availableQuantity: availableProduct.availableQuantity += request.body.quantityVariation
        })
        return response.status(200).json({
            "response": productInCart
        })
    } catch (error) { console.log(error) }
});

router.delete("/cartProduct", async (request, response) => {
    console.log(request.body)
    const product = await Product.findOne({
        where: {
            name: request.body.productName,
            sellerId: request.body.sellerId
        }
    });
    if (!product) {
        return response.status(404).json({
            "response": "Product not found in current user cart"
        });
    }
    const productInCartToDelete = await cartProduct.findOne({
        where: {
            ownerId: request.body.userId,
            productId: product.id
        }
    });
    console.log("WTFFFFFFFFFFF")
    console.log(productInCartToDelete)
    if (!productInCartToDelete) {
        return response.status(404).json({
            "response": "Product not found in current user cart"
        });
    }
    await productInCartToDelete.destroy();
    return response.status(200).json({
        "response": "Product removed from cart"
    });
});

router.delete("/cartProducts", async (request, response) => {
    try {
        console.log("BODY??", request.body)
        request.body.forEach(async (productInCart) => {
            console.log("productId: ", productInCart.productId)
            console.log("quantity: ", productInCart.quantity)
            //TODO fix this
            var cartProductToDelete = await cartProduct.findByPk(productInCart.id)
            console.log("DELETE!!!!", cartProductToDelete)
            cartProductToDelete.destroy()
        })
        return response.status(200).json({
            "response": "Products removed from cart"
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
})

module.exports = router;