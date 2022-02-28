const router = require("express").Router();
const Sequelize = require('sequelize');
const QuotationProduct = require("../models/quotationProduct");
const Op = Sequelize.Op

//POST A QUOTATION ON AN ORDERED PRODUCT
router.post("/quotationProduct", async, (request, response) => {
    try {
        const quotation = new QuotationProduct({
            ownerId: request.body.ownerId,
            productId: request.body.productId,
            value: request.body.quotationValue,
            comment: request.body.comment ? request.body.comment : null
        });
        await quotation.save()
        return response.status(201).json({
            "response": "Quotation created"
        });
    } catch (error) {
        console.log(error)
        return response.status(error.response.status).json({
            "response": error.response.data.response
        });
    }
})