const router = require("express").Router();
const cartProduct = require("../models/cartProduct");
const Sequelize = require('sequelize');
const Product = require("../models/product");
const Cart = require("../models/cart");
const Op = Sequelize.Op

router.get("/cartProducts", async (request, response) => {
    try {
        if (!request.query.userId) {
            return response.status(400).json({
                "response": "Bad request format",
            });
        }
        const userCart = await Cart.findOne({
            where: {
                ownerId: request.query.userId
            }
        });
        if (!userCart) {
            return response.status(404).json({
                "response": "Cart not found"
            });
        }
        console.log("ASSERTION", userCart.id)
        const cartProducts = await cartProduct.findAll({
            where: {
                cartId: userCart.id
            }
        });
        console.log("cartProducts", cartProducts)

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
    // if (!request.body.userId) {
    //     return response.status(400).json({
    //         "response": "Bad request format",
    //     });
    // }
    try {
        const availableProduct = await Product.findOne(
            {
                where: {
                    name: request.body.productName,
                    availableQuantity: { [Op.gt]: 0 },
                    onSale: true
                }
            }
        );

        if (!availableProduct) {
            return response.status(404).json({
                "response": "Product not found"
            });
        }
        if (availableProduct.availableQuantity < request.body.quantity) {
            return response.status(400).json({
                "response": "Not enough products in stock"
            });

        }
        // if (availableProduct.availableQuantity === 0 || availableProduct.availableQuantity < request.body.quantity) {
        //     return response.status(400).json({
        //         "response": "No product in stocks",
        //     });
        // }

        // const cartProductExistant = await cartProduct.findOne(
        //     {
        //         where: {
        //             ownerId: request.body.userId,
        //             productId: availableProduct.id,
        //         }
        //     }
        // );
        const productAlreadyInCart = await cartProduct.findOne({
            where: {
                [Op.and]: [
                    {
                        productId: {
                            [Op.eq]: availableProduct.id
                        },
                        cartId: {
                            [Op.ne]: 0
                        }
                    }
                ]
            }
        });
        console.log("PRODUCT IN CART EXISTS", productAlreadyInCart)
        const existantCart = await Cart.findOne({
            where: {
                ownerId: request.body.userId
            }
        });
        var cartId;
        if (!existantCart) {
            const newCart = new Cart({
                ownerId: request.body.userId
            });
            await newCart.save();
            cartId = newCart.id;
        } else {
            cartId = existantCart.id;
        }
        if (!productAlreadyInCart) {
            const newCartProduct = new cartProduct({
                productId: availableProduct.id,
                quantity: request.body.quantity,
                cartId: cartId
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
        // if (!cartProductExistant) {
        //     const newCartProduct = new cartProduct({
        //         ownerId: request.body.userId,
        //         productId: availableProduct.id,
        //         quantity: request.body.quantity
        //     });
        //     await newCartProduct.save();
        //     return response.status(201).json({
        //         "response": "Product added to cart"
        //     });
        // } else {
        //     return response.status(409).json({
        //         "response": "Product already in cart"
        //     });
        // }



    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
        if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(409).json({
                "response": "Product already existant in current user cart"
            });

        }
    }
});

router.put("/cartProduct", async (request, response) => {
    // if (!request.body.productName || !request.body.userId || !request.body.quantity  || request.body.quantity == 0) {
    //     return response.status(400).json({
    //         "response": "bad json format"
    //     });
    // }
    try {
        const product = await Product.findOne({
            where: {
                name: request.body.productName
            }
        });

        if (product.availableQuantity < request.body.quantity) {
            return response.status(400).json({
                "response": "Not enough products in stock"
            });
        }
        const userCart = await Cart.findOne({
            where: {
                ownerId: request.body.userId,
            }
        });
        if (!userCart) {
            return response.status(404).json({
                "response": "no cart for current user"
            });
        }
        const productInCart = await cartProduct.findOne({
            where: {
                cartId: userCart.id,
                productId: product.id
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
        console.log("#####")
        return response.status(200).json({
            "response": productInCart
        })


        // const product = await Product.findOne({
        //     where: {
        //         name: request.body.productName,
        //         onSale: true,
        //         availableQuantity: { [Op.gt]: 0 }
        //     }
        // });
        // console.log("###", product.id)
        // const cartProductToUpdate = await cartProduct.findOne(
        //     {
        //         where: {
        //             ownerId: request.body.userId,
        //             productId: product.id
        //         }
        //     }
        // )

        // if (!cartProductToUpdate) {
        //     return response.status(404).json({
        //         "response": "Item not found in cart",
        //     });
        // }

        // cartProductToUpdate.set({
        //     quantity: request.body.quantity,
        //     productName: request.body.productName
        // })
        // await cartProductToUpdate.save();
        // return response.status(200).json({
        //     "response": cartProductToUpdate
        // });

    } catch (error) { console.log(error) }
});

router.delete("/cartProduct", async (request, response) => {
    // if (!request.body.productName || !request.body.userId) {
    //     return response.status(400).json({
    //         "response": "bad json format"
    //     });
    // }
    const product = await Product.findOne({
        where: {
            name: request.body.productName
        }
    })
    const userCart = await Cart.findOne({
        where: {
            ownerId: request.body.userId,
        }
    });
    if (!userCart) {
        return response.status(404).json({
            "response": "no cart for current user"
        });
    }
    const productInCartToDelete = await cartProduct.findOne({
        where: {
            cartId: userCart.id,
            productId: product.id
        }
    });
    if (!productInCartToDelete) {
        return response.status(404).json({
            "response": "product not found in current user cart"
        });
    }
    await productInCartToDelete.destroy();
    return response.status(200).json({
        "response": "product deleted from cart"
    });

    // const product = await Product.findOne({
    //     where: {
    //         name: request.body.productName
    //     }
    // });
    // if (!product) {
    //     return response.status(404).json({
    //         "response": "product not found"
    //     })
    // }
    // const cartProductToDelete = await cartProduct.findOne({
    //     where: {
    //         ownerId: request.body.userId,
    //         productId: product.id
    //     }
    // });
    // if (!cartProductToDelete) {
    //     return response.status(404).json({
    //         "response": "product not found"
    //     })
    // }
    // await cartProductToDelete.destroy();
    // return response.status(200).json({
    //     "response": "product deleted from cart"
    // });
});


router.delete("/cartProduct", async (request, response) => {
    try {
        console.log("BODY", request.body)
        request.body.forEach(async (cartProduct) => {
            console.log("productId: ", cartProduct.productId)
            console.log("quantity: ", cartProduct.quantity)
            var productToDelete = await cartProduct.findByPk(cartProduct.id)
            productToDelete.destroy()
        })
        return response.status(200).json({
            "response": "Products removed from cart"
        });
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
})

module.exports = router;