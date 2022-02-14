const router = require("express").Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const ProductTag = require("../models/productTag");

router.get("/products", async (request, response) => {
    if (!request.query.lowerPrice || !request.query.higherPrice || !request.query.condition || !request.query.userId || !request.query.name || !request.query.category || !request.query.filter) {
        return response.status(400).json({
            "response": "Bad request format",
        });
    }
    var usersIds = []
    await request.query.userId.forEach(
        (id) => {
            usersIds.push(parseInt(id))
        }
    )
    const lowerPrice = request.query.lowerPrice
    const higherPrice = request.query.higherPrice
    const condition = request.query.condition
    const filter = request.query.filter

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
    console.log("####################")
    // try {
    const products = await Product.findAndCountAll({
        where: {
            [Op.and]: [
                { name: { [Op.substring]: request.query.name } },
                { productCategoryId: { [Op.in]: categoriesIds }, },
                { productTagId: { [Op.in]: tagsIds } },
                { ownerId: { [Op.in]: usersIds } },
                { unitPrice: { [Op.gte]: lowerPrice } },
                { unitPrice: { [Op.lte]: higherPrice } },
                { condition: { [Op.eq]: condition } }
            ]
        }, sort: [[filter, "ASC"]]
    });
    //} catch (error) { console.log("ERROR", error) }
    return response.status(200).json({
        "response": products.rows,
        "rows": products.count
    });

});

module.exports = router;