const router = require("express").Router();
const WishProduct = require("../models/wishProduct");
const Sequelize = require('sequelize');
const Product = require("../models/product");
const Op = Sequelize.Op

router.post("/wishProduct", async (request, response) => {
    try {
        const wishedProduct = await Product.findOne({
            where: {
                name: request.body.productName,
                sellerId: request.body.sellerId
            }
        });
        if (request.query.quantity > wishedProduct.quantity) {
            return response.status(404).json({
                "response": "Product not in stock"
            })
        }
        const wishProduct = new WishProduct({
            ownerId: request.body.ownerId,
            productId: wishedProduct.id,
            sellerId: request.bodu.sellerId,
            quantity: request.body.quantity
        });
        await wishProduct.save();
        return response.status(201).json({
            "response": "Product added to wishlist"
        })
    } catch (error) {
        console.log(error)
    }
});

router.get("/wishProducts", async (request, response) => {
    try {
        const userWishList = await WishProduct.findAll({
            where: {
                ownerId: request.query.ownerId
            }
        });
        if (userWishList.length == 0) {
            return response.status(404).json({
                "response": "No product found in wishlist"
            });
        }
        return response.status(200).json({
            "response": userWishList
        });
    } catch (error) {
        console.log(error)
    }
});

router.put("/wishProduct", async (request, response) => {
    try {
        const wishedProduct = await Product.findOne({
            where: {
                name: request.body.productName,
                sellerId: request.body.sellerId
            }
        });
        if (request.query.quantity > wishedProduct.quantity) {
            return response.status(404).json({
                "response": "Product not in stock"
            })
        }
        const wishProductToUpdate = await WishProduct.findOne({
            where: {
                ownerId: request.body.userId,
                productId: wishedProduct.id,
                sellerId: request.body.sellerId
            }
        });
        await wishProductToUpdate.update({
            quantity: request.body.quantity
        });
        return response.status(200).json({
            "response": wishProductToUpdate
        });
    } catch (error) {
        console.log(error)
    }
});

router.delete("/wishProduct", async (request, response) => {
    try {
        const wishedProduct = await Product.findOne({
            where: {
                name: request.body.productName,
                sellerId: request.body.sellerId
            }
        });
        if (request.query.quantity > wishedProduct.quantity) {
            return response.status(404).json({
                "response": "Product not in stock"
            });
        }
        const wishProductsToDelete = await WishProduct.findOne({
            ownerId: request.body.userId,
            productId: wishedProduct.id,
            sellerId: request.body.sellerId
        });
        await wishProductsToDelete.destroy();
        return response.status(200).json({
            "response": "Product removed from wishlist"
        });
    } catch (error) {
        console.log(error)
    }
});