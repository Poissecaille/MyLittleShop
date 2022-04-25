const router = require("express").Router();
const Sequelize = require('sequelize');
const ProductCategory = require("../models/productCategory");
const ProductTag = require("../models/productTag");
const Product = require("../models/product");
const Op = Sequelize.Op


// DEDICATED ROAD FOR ORDERS RATING
router.get("/buyer/product", async (request, response) => {
    try {
        const productToRate = Product.findOne({
            where: {
                sellerId: request.query.sellerId,
                name: request.query.productName
            }
        });
        if (!productToRate) {
            return response.status(404).json({
                "response": "Product not found"
            });
        } else {
            return response.status(200).json({
                "response": productToRate.data.response
            });
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// CONSULT PRODUCTS FOR BUYERS
router.get("/buyer/products", async (request, response) => {
    try {
        var sellersIds = [];
        var productsIdsPerCategory = [];
        var productsIdsPerTag = [];
        var productsIds = [];

        if (Array.isArray(request.query.sellerId)) {
            console.log(request.query.sellerId)
            request.query.sellerId.forEach(
                (id) => {
                    sellersIds.push(parseInt(id))
                }
            )
        } else {
            sellersIds.push(parseInt(request.query.sellerId))
        }
        if (request.query.category || request.query.tag) {
            console.log(request.query.category)
            const productCategories = await ProductCategory.findAll({
                where:
                {
                    name: request.query.category
                }
            });
            for (let i = 0; i < productCategories.length; i++) {
                productsIdsPerCategory.push(productCategories[i].productId)
            }
            if (request.query.tag) {
                const productTags = await ProductTag.findAll({
                    where:
                    {
                        name: request.query.tag,
                    }
                });
                for (let i = 0; i < productTags.length; i++) {
                    productsIdsPerTag.push(productTags[i].productId)
                }
                productsIds = productsIdsPerCategory.filter((value) => productsIdsPerTag.includes(value));
            } else {
                for (let i = 0; i < productsIdsPerCategory.length; i++) {
                    productsIds.push(productsIdsPerCategory[i])
                }
            }
        }
        const products = await Product.findAndCountAll({
            where: {
                [Op.and]: [
                    //{ id: productsIds.length > 0 ? { [Op.in]: productsIds } : { [Op.not]: null } },
                    { id: request.query.category || request.query.tag ? { [Op.in]: productsIds } : { [Op.not]: null } },
                    { sellerId: request.query.sellerId !== undefined ? { [Op.in]: sellersIds } : { [Op.not]: null } },
                    { unitPrice: { [Op.between]: [request.query.lowerPrice, request.query.higherPrice] } },
                    { condition: request.query.condition !== undefined ? { [Op.eq]: request.query.condition } : { [Op.not]: null } },
                    { availableQuantity: { [Op.gt]: 0 } },
                    { onSale: true }
                ]
            }, sort: [[request.query.filter, "ASC"]]
        });
        return response.status(200).json({
            "response": products.rows,
            "rows": products.count
        });
    } catch (error) {
        console.log(error)
        if (error.name == "SequelizeDatabaseError") {
            return response.status(400).json({
                "response": "Bad json format",
            });
        }
        else {
            response.status(error.response.status).json({
                "response": error.response.data.response
            });
        }
    }
});

// CONSULT PRODUCTS FOR SELLERS
router.get("/seller/products", async (request, response) => {
    try {
        const sellerProducts = await Product.findAll({
            where: {
                sellerId: request.query.sellerId ? request.query.sellerId : { [Op.in]: request.query.sellerIds },
            }
        });
        if (!sellerProducts) {
            return response.status(404).json({
                "response": "No product to sell for the current user"
            });
        } else {
            return response.status(200).json({
                "response": sellerProducts
            });
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// CONSULT ONE PRODUCT FOR SELLERS ORDERS
router.get("/seller/product", async (request, response) => {
    try {
        console.log(request.query)
        console.log("##########chap###########")
        console.log(request.query.sellerId)
        const sellerProducts = await Product.findOne({
            where: {
                sellerId: request.query.sellerId,
                name: request.query.productName
            }
        });
        if (!sellerProducts) {
            return response.status(404).json({
                "response": "No product to sell for the current user"
            });
        } else {
            return response.status(200).json({
                "response": sellerProducts
            });
        }
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// WITHDRAW FROM SELL THE PRODUCTS OWNED BY DISABLED SELLER ACCOUNTS
router.put("/seller/products", async (request, response) => {
    const productsToWithdraw = await Product.findAll({
        where: {
            sellerId: request.query.userId,
            onSale: true
        }
    });
    if (productsToWithdraw.length == 0) {
        return response.status(200).json({
            "response": "account deleted"
        });
    }
    productsToWithdraw.forEach((product) => {
        product.update({
            onSale: false
        });
    });
    return response.status(200).json({
        "response": "account deleted and products withdrawn from sale"
    });
});

// ROAD FOR PRODUCTS QUANTITY UPDATE AFTER ORDER CREATION
router.put("/products", async (request, response) => {
    try {
        console.log("BODY", request.body)
        request.body.forEach(async (cartProduct) => {
            console.log("productId: ", cartProduct.productId)
            console.log("quantity: ", cartProduct.quantity)
            var productToUpdate = await Product.findByPk(cartProduct.productId)
            productToUpdate.update({
                availableQuantity: productToUpdate.availableQuantity - cartProduct.quantity
            });
        })
        return response.status(200).json({
            "response": "Stocks updated"
        });
    } catch (error) {
        console.log(error)
        response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
    //const productToUpdate = await Product.fin
})


// ADD A PRODUCT FOR SELLERS //TODO HANDLE PRODUCT CATEGOEY AND TAG FOR PUT AND POST
router.post("/seller/product", async (request, response) => {
    try {
        const newSellerProduct = new Product({
            name: request.body.name,
            label: request.body.label,
            condition: request.body.condition,
            description: request.body.description,
            unitPrice: request.body.unitPrice,
            availableQuantity: request.body.availableQuantity,
            sellerId: request.body.sellerId,
        })
        await newSellerProduct.save();
        return response.status(201).json({
            "response": "New product added"
        });
    } catch (error) {
        if (error.name === "SequelizeDatabaseError") {
            return response.status(400).json({
                "response": "Bad json format"
            });
        }
        else if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(409).json({
                "response": "Product already existant for current user"
            });
        }
    }
});

// MODIFY A PRODUCT FOR SELLERS 
router.put("/seller/product", async (request, response) => {
    try {
        const productToUpdate = await Product.findOne({
            where: {
                name: request.body.name,
                sellerId: request.body.userId
            }
        });
        if (!productToUpdate) {
            return response.status(404).json({
                "response": "Product not found for current user"
            });
        }
        // if (request.body.categoryNames) {
        //     var categoryIds = []
        //     request.body.categoryNames.forEach(async (categoryName) => {
        //         await ProductCategory.findOne({
        //             where: {
        //                 name: categoryName
        //             }
        //         });
        //         categoryIds.push(categoryName.id)
        //     })
        // }
        // if (request.body.tagNames) {
        //     var tagsIds = []
        //     request.body.tagNames.forEach(async (tagName) => {
        //         await ProductTag.findOne({
        //             where: {
        //                 name: tagName
        //             }
        //         });
        //         tagsIds.push(tagName.id)
        //     })
        // }
        if (request.body.availableQuantity !== undefined || request.body.availableQuantity == 0) {
            if (request.body.onSale == true)
                return response.status(400).json({
                    "response": "Bad json format",
                });
            request.body.onSale = false
        }

        await productToUpdate.update({
            name: request.body.newName !== undefined ? request.body.newName : productToUpdate.name,
            label: request.body.label !== undefined ? request.body.label : productToUpdate.label,
            condition: request.body.condition !== undefined ? request.body.condition : productToUpdate.condition,
            description: request.body.description !== undefined ? request.body.description : productToUpdate.description,
            unitPrice: request.body.unitPrice !== undefined ? request.body.unitPrice : productToUpdate.unitPrice,
            availableQuantity: request.body.availableQuantity !== undefined ? request.body.availableQuantity : productToUpdate.availableQuantity,
            onSale: request.body.onSale !== undefined ? request.body.onSale : productToUpdate.onSale
        });
        return response.status(200).json({
            "response": productToUpdate.dataValues
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// DELETE A PRODUCT FOR SELLERS 
router.delete("/seller/product", async (request, response) => {
    try {
        const productToDelete = await Product.findOne({
            where: {
                name: request.body.productName,
                sellerId: request.body.sellerId
            }
        });
        await productToDelete.destroy();
        return response.status(200).json({
            "response": "Product deleted"
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

// SYNC CARTPRODUCT FOR AGGREGATOR
router.get("/productsPerId", async (request, response) => {
    try {
        const products = await Product.findAll({
            where: {
                id: { [Op.in]: request.query.productIds }
            }
        });
        return response.status(200).json({
            "response": products
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});

//GET PRODUCTS FOR ORDERS
router.get("/orderedProduct", async (request, response) => {
    try {
        const products = await Product.findAll({
            where: {
                id: { [Op.in]: request.query.productIds }
            }
        });
        return response.status(200).json({
            "response": products
        });
        // const product = await Product.findByPk(request.query.productId)
        // return response.status(200).json({
        //     "response": product
        // });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});


//DEDICATED ROAD FOR PRODUCTS AVERAGE RATING UPDATE
router.put("/updateProductRating", async (request, response) => {
    try {
        const productToUpdate = await Product.findByPk(request.body.productId)
        await productToUpdate.update({
            averageRating: request.body.averageRating
        });
        await productToUpdate.save();
        return response.status(200).json({
            "response": productToUpdate
        });
    }
    catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
});
module.exports = router;