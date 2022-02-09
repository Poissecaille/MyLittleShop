const router = require("express").Router();
const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
const ProductTag = require("../models/productTag");

router.get("/product", async (request, response) => {
    var filters = {}
    // CONTACT AGGREGATOR
    if ("name" in request.query) {
        const name = await Product.findAll({
            where: {
                name: request.query.name
            }
        });
        filters["name"] = name
    }
    if ("category" in request.query) {
        const category = await ProductCategory.findOne({
            where: {
                name: request.query.category
            }
        });
        filters["category_id"] = category.id
    }
    if ("tag" in request.query) {
        const tag = await ProductTag.findOne({
            where: {
                name: request.query.tag
            }
        });
        filters["tag_id"] = tag.id
    }

})

module.exports = router;