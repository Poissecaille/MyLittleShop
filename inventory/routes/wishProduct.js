const router = require("express").Router();
const WishProduct = require("../models/wishProduct");
const Sequelize = require('sequelize');
const Product = require("../models/product");
const Op = Sequelize.Op
var logger = require('../settings/logger');


router.get("/newsLetter", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, query:${request.query}`)
        const userWishList = request.query.offset && request.query.limit ? await WishProduct.findAll({
            where: {
                id: { [Op.gt]: request.query.offset, [Op.lt]: request.query.limit },
            }
        }
        )
            :
            await WishProduct.findAll();
        return response.status(200).json({
            "response": userWishList
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

router.post("/wishProduct", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        if (request.body.quantity > request.body.availableQuantity) {
            return response.status(404).json({
                "response": "Product not in stock"
            })
        }
        const wishProduct = new WishProduct({
            ownerId: request.body.ownerId,
            productId: request.body.productId,
            quantity: request.body.quantity
        });
        await wishProduct.save();
        return response.status(201).json({
            "response": "Product added to wishlist"
        })
    } catch (error) {
        console.log(error)
        if (error.name === "SequelizeUniqueConstraintError") {
            logger.error(`timestamp:${loggerDate}, errorName:${error.name}, queryParameters:${error.parent.parameters}`)
            return response.status(409).json({
                "response": "Product already rated"
            });
        }
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

router.get("/wishProducts", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, query:${request.query}`)
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
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

router.put("/wishProduct", async (request, response) => {
    try {
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
        logger.debug(`BODY: ${request.body}`)
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
                ownerId: request.body.ownerId,
                productId: wishedProduct.id,
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
        var loggerDate = new Date().toISOString()
        logger.info(`timestamp:${loggerDate}, headers:${request.headers}, url:${request.url}, method:${request.method}, body:${request.body}`)
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
module.exports = router;