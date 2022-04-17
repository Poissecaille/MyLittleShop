const  app  = require('../app') //important
const CryptoJS = require("crypto-js")
const { faker } = require('@faker-js/faker');
const { sequelizeTest } = require("../settings/database")
const Product = require("../models/product");
const { UniqueConstraintError, ValidationError } = require("sequelize")
const getRandomInt = require('../utils/utils');
const db = sequelizeTest


describe("inventory-product unit tests", () => {

    beforeAll(async () => {
        jest.restoreAllMocks();
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })

    const condition = ["new", "occasion", "renovated"];


    it("Test-save should be able to create a new product without throwing error", async () => {
        
        const fakeProduct = {
            name: faker.commerce.productName(),
            label: faker.commerce.productAdjective(),
            condition : condition[getRandomInt(0,3)],
            description: faker.commerce.productDescription(),
            unitPrice: faker.commerce.price(),
            availableQuantity : getRandomInt(0,20),
            sellerId: getRandomInt(0,100),
            onSale: Math.random() < 0.5
        }

        const product = new Product({
            name: fakeProduct.name,
            label: fakeProduct.label,
            condition : fakeProduct.condition,
            description: fakeProduct.description,
            unitPrice: fakeProduct.unitPrice,
            availableQuantity : fakeProduct.availableQuantity,
            sellerId: fakeProduct.sellerId,
            onSale: fakeProduct.onSale
        })
        expect(async () => await product.save().not.toThrow(Error))  
    })


    it("Test-findOne should be able to find the correct product",async () => {
        const fakeProduct = {
            name: faker.commerce.productName(),
            label: faker.commerce.productAdjective(),
            condition : condition[getRandomInt(0,3)],
            description: faker.commerce.productDescription(),
            unitPrice: faker.commerce.price(),
            availableQuantity : getRandomInt(0,20),
            sellerId: getRandomInt(0,100),
            onSale: Math.random() < 0.5
        }

        const product = new Product({
            name: fakeProduct.name,
            label: fakeProduct.label,
            condition : fakeProduct.condition,
            description: fakeProduct.description,
            unitPrice: fakeProduct.unitPrice,
            availableQuantity : fakeProduct.availableQuantity,
            sellerId: fakeProduct.sellerId,
            onSale: fakeProduct.onSale
        })
        await product.save()


        const result = await Product.findOne({
            where: {
                name: fakeProduct.name,
                sellerId: fakeProduct.sellerId
            }
        });
        expect(result).toBeInstanceOf(Product);
        expect(result.dataValues).toEqual(product.dataValues);
        
    })

    it("Test-findAll should be able to find all products", async () => {
        for (let i=0;i<10;i++){
            const product = new Product({
                name: faker.commerce.productName(),
                label: faker.commerce.productAdjective(),
                condition : condition[getRandomInt(0,3)],
                description: faker.commerce.productDescription(),
                unitPrice: faker.commerce.price(),
                availableQuantity : getRandomInt(0,20),
                sellerId: getRandomInt(0,100),
                onSale: Math.random() < 0.5
            })
            await product.save()
        }
        expect(async () => await Product.findAll()).not.toThrow(Error)
        const result = await Product.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
        
    })

    it("Test-save should conflit if sellerId and name are the same", async () => {
        const fakeProduct = {
            name: faker.commerce.productName(),
            label: faker.commerce.productAdjective(),
            condition : condition[getRandomInt(0,3)],
            description: faker.commerce.productDescription(),
            unitPrice: faker.commerce.price(),
            availableQuantity : getRandomInt(0,20),
            sellerId: getRandomInt(0,100),
            onSale: Math.random() < 0.5
        }
        const product = new Product({
            name: fakeProduct.name,
            label: fakeProduct.label,
            condition : fakeProduct.condition,
            description: fakeProduct.description,
            unitPrice: fakeProduct.unitPrice,
            availableQuantity : fakeProduct.availableQuantity,
            sellerId: fakeProduct.sellerId,
            onSale: fakeProduct.onSale
        })
        const product2 = new Product({
            name: fakeProduct.name,
            label: fakeProduct.label,
            condition : fakeProduct.condition,
            description: fakeProduct.description,
            unitPrice: fakeProduct.unitPrice,
            availableQuantity : fakeProduct.availableQuantity,
            sellerId: fakeProduct.sellerId,
            onSale: fakeProduct.onSale
        })

        await product.save()
        expect(async () => await product.save().not.toThrow(UniqueConstraintError))
        expect(async() => await product2.save().toThrow(UniqueConstraintError))

    })
    
})