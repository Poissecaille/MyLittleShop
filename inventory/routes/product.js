const router = require("express").Router();
const Sequelize = require('sequelize');
const ProductCategory = require("../models/productCategory");
const ProductTag = require("../models/productTag");
const Op = Sequelize.Op
const Product = require("../models/product");

// CONSULT PRODUCTS FOR BUYERS
router.get("/buyer/products", async (request, response) => {
    var condition;
    var lowerPrice;
    var higherPrice;
    var filter;

    if (!request.query.lowerPrice) {
        lowerPrice = 0;
    } else {
        lowerPrice = request.query.lowerPrice;
    }
    if (!request.query.higherPrice) {
        higherPrice = Infinity;
    } else {
        higherPrice = request.query.higherPrice;
    }
    if (!request.query.filter) {
        filter = "unitPrice";
    } else {
        filter = request.query.filter;
    }

    var usersIds = []
    if (Array.isArray(request.query.userId)) {
        await request.query.userId.forEach(
            (id) => {
                usersIds.push(parseInt(id))
            }
        )
    } else {
        usersIds.push(parseInt(request.query.userId))
    }

    var categoriesIds = []
    const categories = await ProductCategory.findAll({
        where:
        {
            name: {
                [Op.substring]: request.query.category,
            }
        }
    });

    var tagsIds = []
    const tags = await ProductTag.findAll({
        where:
        {
            name: {
                [Op.substring]: request.query.tag,
            }
        }
    });

    await tags.forEach(
        (tag) => {
            tagsIds.push(tag.id)
        }
    );
    await categories.forEach(
        (category) => {
            categoriesIds.push(category.id)
        }
    );

    console.log("####################")
    console.log(categoriesIds)
    console.log(tagsIds)
    console.log(usersIds)
    console.log(lowerPrice)
    console.log(higherPrice)
    console.log(condition)
    console.log(request.query)
    console.log("####################")

    const products = await Product.findAndCountAll({
        where: {
            [Op.and]: [
                { name: request.query.name ? { [Op.substring]: request.query.name } : { [Op.not]: null } },
                { productCategoryId: categoriesIds == true ? { [Op.in]: categoriesIds } : { [Op.not]: null } },
                { productTagId: tagsIds == true ? { [Op.in]: tagsIds } : { [Op.not]: null } },
                { ownerId: usersIds == true ? { [Op.in]: usersIds } : { [Op.not]: null } },
                { unitPrice: { [Op.between]: [lowerPrice, higherPrice] } },
                { condition: condition ? { [Op.eq]: condition } : { [Op.not]: null } },
                { availableQuantity: { [Op.gt]: 0 } }
            ]
        }, sort: [[filter, "ASC"]]
    });
    return response.status(200).json({
        "response": products.rows,
        "rows": products.count
    });

});

// CONSULT PRODUCTS FOR SELLERS
router.get("/seller/products", async (request, response) => {
    const sellerProducts = await Product.findAll({
        where: {
            ownerId: request.query.userId
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
});

// ADD A PRODUCT FOR SELLERS
router.post("/seller/product", async (request, response) => {
    try {
        const newSellerProduct = new Product(
            request.body
        )
        await newSellerProduct.save();
        return response.status(201).json({
            "response": "New product added"
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return response.status(409).json({
                "response": "Product already existant for current user"
            });
        }
    }
})

module.exports = router;