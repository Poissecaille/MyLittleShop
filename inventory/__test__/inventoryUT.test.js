const  app  = require('../app') //important
const { faker } = require('@faker-js/faker');
const { sequelizeTest } = require("../settings/database")
const Product = require("../models/product");
const Cart = require("../models/cart");
const CartProduct = require("../models/cartProduct");
const ProductCategory = require("../models/productCategory");
const ProductTag = require("../models/productTag");
const RatingProduct = require("../models/ratingProduct");
const wishProduct = require("../models/wishProduct");
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

describe("inventory-cart unit tests", () => {

    beforeAll(async () => {
        jest.restoreAllMocks();
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })

    it("Test-save should be able to create a new cart without throwing error", async () => {
        const cart = new Cart({
            ownerId: getRandomInt(0,100),
        })


        
        expect(async () => await cart.save().not.toThrow(Error))  
    })

    it("Test-findOne should be able to find the correct cart",async () => {
        const cart = new Cart({
            ownerId: getRandomInt(0,100),
        })
        await cart.save()

        const result = await Cart.findOne({
            where: {
                ownerId: cart.ownerId
            }
        });
        expect(result).toBeInstanceOf(Cart);
        expect(result.dataValues).toEqual(cart.dataValues);
        
    })

    it("Test-findAll should be able to find all carts", async () => {
        for (let i=0;i<10;i++){
            const cart = new Cart({
                ownerId: i,
            })
            await cart.save()
        }
        expect(async () => await Cart.findAll()).not.toThrow(Error)
        const result = await Cart.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
        
    })

    it("Test-save should conflit if ownerId is the same", async () => {
        const id = getRandomInt(0,100)
        const cart = new Cart({
            ownerId: id,
        })
        const cart2 = new Cart({
            ownerId: id,
        })
        expect(async () => await cart.save().not.toThrow(UniqueConstraintError))
        expect(async() => await cart2.save().toThrow(UniqueConstraintError))

    })


    
    
})

describe("inventory-cartProduct unit tests", () => {
    beforeAll(async () => {
        jest.restoreAllMocks();
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })


    it("Test-save should be able to create a new cartProduct without throwing error", async () => {
        const cartProduct = new CartProduct({
            ownerId: getRandomInt(0,100),
            productId: getRandomInt(0,100),
            quantity: getRandomInt(0,20)
        })

        expect(async () => await cartProduct.save().not.toThrow(Error))  
    })

    it("Test-findOne should be able to find the correct cartProduct",async () => {
        const cartProduct = new CartProduct({
            ownerId: getRandomInt(0,100),
            productId: getRandomInt(0,100),
            quantity: getRandomInt(0,20)
        })
        await cartProduct.save()

        const result = await CartProduct.findOne({
            where: {
                ownerId: cartProduct.ownerId,
                productId: cartProduct.productId
            }
        });
        expect(result).toBeInstanceOf(CartProduct);
        expect(result.dataValues).toEqual(cartProduct.dataValues);
        
    })

    it("Test-findAll should be able to find all cartProducts", async () => {
        for (let i=0;i<10;i++){
            const cartProduct = new CartProduct({
                ownerId: i,
                productId: i,
                quantity: getRandomInt(0,20)
            })
            await cartProduct.save()
        }
        expect(async () => await CartProduct.findAll()).not.toThrow(Error)
        const result = await CartProduct.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
    })

    it("Test-save should conflit if ownerId and productId are the same", async () => {
        const id = getRandomInt(0,100)
        const cartProduct = new CartProduct({
            ownerId: id,
            productId: id,
            quantity: getRandomInt(0,20)
        })
        const cartProduct2 = new CartProduct({
            ownerId: id,
            productId: id,
            quantity: getRandomInt(0,20)
        })
        expect(async () => await cartProduct.save().not.toThrow(UniqueConstraintError))
        expect(async() => await cartProduct2.save().toThrow(UniqueConstraintError))

    })

    it("Test-save should not conflit if ownerId or productId are different", async () => {
        const id = getRandomInt(0,100)
        const cartProduct = new CartProduct({
            ownerId: id,
            productId: id,
            quantity: getRandomInt(0,20)
        })
        const cartProduct2 = new CartProduct({
            ownerId: id,
            productId: id+1,
            quantity: getRandomInt(0,20)
        })
        const cartProduct3 = new CartProduct({
            ownerId: id+1,
            productId: id,
            quantity: getRandomInt(0,20)
        })
        expect(async() => await cartProduct.save().not.toThrow(UniqueConstraintError))
        expect(async() => await cartProduct2.save().not.toThrow(UniqueConstraintError))
        expect(async() => await cartProduct3.save().not.toThrow(UniqueConstraintError))
    })


})

describe("inventory-productCategory unit tests", () => {
    beforeAll(async () => {
        jest.restoreAllMocks();
        
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })
    const condition = ["new", "occasion", "renovated"];

    it("Test-save should be able to create a new productCategory without throwing error", async () => {
        
        const fakeProduct = new Product ({
            name: faker.commerce.productName(),
            label: faker.commerce.productAdjective(),
            condition : condition[getRandomInt(0,3)],
            description: faker.commerce.productDescription(),
            unitPrice: faker.commerce.price(),
            availableQuantity : getRandomInt(0,20),
            sellerId: getRandomInt(0,100),
            onSale: Math.random() < 0.5
        })    
        await fakeProduct.save();

        const productCategory = new ProductCategory({
            productId: 0,
            name: faker.random.word()
        })
        expect(async () => await productCategory.save().not.toThrow(Error))
          
    })

    it("Test-findOne should be able to find the correct productCategory",async () => {
        const fakeProduct = new Product ({
            name: faker.commerce.productName(),
            label: faker.commerce.productAdjective(),
            condition : condition[getRandomInt(0,3)],
            description: faker.commerce.productDescription(),
            unitPrice: faker.commerce.price(),
            availableQuantity : getRandomInt(0,20),
            sellerId: getRandomInt(0,100),
            onSale: Math.random() < 0.5
        })    
        await fakeProduct.save();


        const productCategory = new ProductCategory({
            productId: 1,
            name: faker.random.word()
        })

        await productCategory.save();
        const result = await ProductCategory.findOne({
            where: {
                productId: productCategory.productId,
                name: productCategory.name
            }
        });
        expect(result).toBeInstanceOf(ProductCategory);
        expect(result.dataValues).toEqual(productCategory.dataValues);
        
    })

    /*it("Test-findAll should be able to find all productCategories", async () => {
        for (let i=0;i<10;i++){
            const productCategory = new ProductCategory({
                productId: i,
                name: faker.random.word()
            })
            await productCategory.save()
        }
        expect(async () => await ProductCategory.findAll()).not.toThrow(Error)
        const result = await ProductCategory.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
    })*/

    it("Test-save should conflit if productId and name are the same", async () => {
        const id = getRandomInt(0,100)
        const name = faker.random.word()
        const productCategory = new ProductCategory({
            productId: id,
            name: name
        })
        const productCategory2 = new ProductCategory({
            productId: id,
            name: name
        })
        expect(async () => await productCategory.save().not.toThrow(UniqueConstraintError))
        expect(async() => await productCategory2.save().toThrow(UniqueConstraintError))

    })

    it("Test-save should not conflit if productId or name are different", async () => {
        const id = getRandomInt(0,100)
        const name = faker.random.word()
        const productCategory = new ProductCategory({
            productId: id,
            name: name
        })
        const productCategory2 = new ProductCategory({
            productId: id+1,
            name: name
        })
        const productCategory3 = new ProductCategory({
            productId: id,
            name: name+1
        })
        expect(async() => await productCategory.save().not.toThrow(UniqueConstraintError))
        expect(async() => await productCategory2.save().not.toThrow(UniqueConstraintError))
        expect(async() => await productCategory3.save().not.toThrow(UniqueConstraintError))
    })

})