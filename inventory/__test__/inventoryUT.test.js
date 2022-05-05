const  app  = require('../app') //important
const { faker } = require('@faker-js/faker');
const { sequelizeTest } = require("../settings/database")
const Product = require("../models/product");
const Cart = require("../models/cart");
const CartProduct = require("../models/cartProduct");
const ProductCategory = require("../models/productCategory");
const ProductTag = require("../models/productTag");
const RatingProduct = require("../models/ratingProduct");
const WishProduct = require("../models/wishProduct");
const { UniqueConstraintError, ValidationError } = require("sequelize")
const getRandomInt = require('../utils/utils');
const db = sequelizeTest

const execSync = require('child_process').execSync;
afterAll(async () => {
    await db.sync({ force: true }).
        then(
            () => {
                try {
                    execSync('npx sequelize-cli  db:seed --seed 20220205145748-products.js', { encoding: 'utf-8' });
                } catch (error) { console.log(error) }
                try {
                    execSync('npx sequelize-cli  db:seed --seed 20220205122444-categories.js', { encoding: 'utf-8' });
                } catch (error) { console.log(error) }
                try {
                    execSync('npx sequelize-cli  db:seed --seed 20220213104607-tags.js', { encoding: 'utf-8' });
                } catch (error) { console.log(error) }
            }
        )
})



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
        expect(async () => await product.save().not.toThrow(ValidationError))  
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
            productId: 1,
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

    it("Test-findAll should be able to find all productCategories", async () => {
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
        for (let i=0;i<10;i++){
            const productCategory = new ProductCategory({
                productId: 1,
                name: faker.random.word()
            })
            await productCategory.save()
        }
        expect(async () => await ProductCategory.findAll()).not.toThrow(Error)
        const result = await ProductCategory.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
    })

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

describe("inventory-productTag unit tests", () => {
    beforeAll(async () => {
        jest.restoreAllMocks();
        
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })
    const condition = ["new", "occasion", "renovated"];

    it("Test-save should be able to create a new productTag without throwing error", async () => {
        
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

        const productTag = new ProductTag({
            productId: 1,
            name: faker.random.word()
        })
        expect(async () => await productTag.save().not.toThrow(Error))
          
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


        const productTag = new ProductTag({
            productId: 1,
            name: faker.random.word()
        })

        await productTag.save();
        const result = await ProductTag.findOne({
            where: {
                productId: productTag.productId,
                name: productTag.name
            }
        });
        expect(result).toBeInstanceOf(ProductTag);
        expect(result.dataValues).toEqual(productTag.dataValues);
        
    })

    it("Test-findAll should be able to find all productCategories", async () => {
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
        for (let i=0;i<10;i++){
            const productTag = new ProductTag({
                productId: 1,
                name: faker.random.word()
            })
            await productTag.save()
        }
        expect(async () => await ProductTag.findAll()).not.toThrow(Error)
        const result = await ProductTag.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
    })

    it("Test-save should conflit if productId and name are the same", async () => {
        const id = getRandomInt(0,100)
        const name = faker.random.word()
        const productTag = new ProductTag({
            productId: id,
            name: name
        })
        const productTag2 = new ProductTag({
            productId: id,
            name: name
        })
        expect(async () => await productTag.save().not.toThrow(UniqueConstraintError))
        expect(async() => await productTag2.save().toThrow(UniqueConstraintError))

    })

    it("Test-save should not conflit if productId or name are different", async () => {
        const id = getRandomInt(0,100)
        const name = faker.random.word()
        const productTag = new ProductTag({
            productId: id,
            name: name
        })
        const productTag2 = new ProductTag({
            productId: id+1,
            name: name
        })
        const productTag3 = new ProductTag({
            productId: id,
            name: name+1
        })
        expect(async() => await productTag.save().not.toThrow(UniqueConstraintError))
        expect(async() => await productTag2.save().not.toThrow(UniqueConstraintError))
        expect(async() => await productTag3.save().not.toThrow(UniqueConstraintError))
    })
})

describe("inventory-ratingProduct unit tests", () => {
    beforeAll(async () => {
        jest.restoreAllMocks();
        
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })
    

    it("Test-save should be able to create a new ratingProduct without throwing error", async () => {
        const ratingProduct = new RatingProduct({
            productId: getRandomInt(0,100),
            ownerId: getRandomInt(0,100),
            value: getRandomInt(0,6),
            comment: faker.random.words(5)
        })
        expect(async () => await ratingProduct.save().not.toThrow(Error))
            
    })

    it("Test-findOne should be able to find the correct ratingProduct",async () => {
        const ratingProduct = new RatingProduct({
            productId: getRandomInt(0,100),
            ownerId: getRandomInt(0,100),
            value: getRandomInt(0,6),
            comment: faker.random.words(5)
        })

        await ratingProduct.save();
        const result = await RatingProduct.findOne({
            where: {
                productId: ratingProduct.productId,
                ownerId: ratingProduct.ownerId
            }
        });
        expect(result).toBeInstanceOf(RatingProduct);
        expect(result.dataValues).toEqual(ratingProduct.dataValues);
        
    })

    it("Test-findAll should be able to find all ratingProducts", async () => {
        
        for (let i=0;i<10;i++){
            const ratingProduct = new RatingProduct({
                productId: getRandomInt(0,100),
                ownerId: getRandomInt(0,100),
                value: getRandomInt(0,6),
                comment: faker.random.words(5)
            })
            await ratingProduct.save()
        }
        expect(async () => await RatingProduct.findAll()).not.toThrow(Error)
        const result = await RatingProduct.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
    })

    it("Test-save should conflit if productId and name are the same", async () => {
        const ratingProduct = new RatingProduct({
            productId: getRandomInt(0,100),
            ownerId: getRandomInt(0,100),
            value: getRandomInt(0,6),
            comment: faker.random.words(5)
        })
        const ratingProduct2 = new RatingProduct({
            productId: ratingProduct.productId,
            ownerId: ratingProduct.ownerId,
            value: getRandomInt(0,6),
            comment: faker.random.words(5)
        })
        expect(async () => await productTag.save().not.toThrow(UniqueConstraintError))
        expect(async() => await productTag2.save().toThrow(UniqueConstraintError))

    })

    it("Test-save should not conflit if productId or ownerId are different", async () => {
        const id = getRandomInt(0,100)
        const ownerId = getRandomInt(0,100)
        const ratingProduct = new RatingProduct({
            productId: id,
            ownerId: ownerId,
            value: getRandomInt(0,6),
            comment: faker.random.words(5)
        })
        const ratingProduct2 = new RatingProduct({
            productId: id+1,
            ownerId: ownerId,
            value: getRandomInt(0,6),
            comment: faker.random.words(5)
        })
        const ratingProduct3 = new RatingProduct({
            productId: id,
            ownerId: ownerId+1,
            value: getRandomInt(0,6),
            comment: faker.random.words(5)
        })
        expect(async() => await ratingProduct.save().not.toThrow(UniqueConstraintError))
        expect(async() => await ratingProduct2.save().not.toThrow(UniqueConstraintError))
        expect(async() => await ratingProduct3.save().not.toThrow(UniqueConstraintError))
    })
})

describe("inventory-wishProduct unit tests", () => {

    beforeAll(async () => {
        jest.restoreAllMocks();
        
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })
    
    it("Test-save should be able to create a new ratingProduct without throwing error", async () => {
        const wishProduct = new WishProduct({
            productId: getRandomInt(0,100),
            ownerId: getRandomInt(0,100),
            quantity: getRandomInt(0,100),
        })
        expect(async () => await wishProduct.save().not.toThrow(Error))
            
    })

    it("Test-findOne should be able to find the correct ratingProduct",async () => {
        const wishProduct = new WishProduct({
            productId: getRandomInt(0,100),
            ownerId: getRandomInt(0,100),
            quantity: getRandomInt(0,100),
        })

        await wishProduct.save();
        const result = await WishProduct.findOne({
            where: {
                productId: wishProduct.productId,
                ownerId: wishProduct.ownerId
            }
        });
        expect(result).toBeInstanceOf(WishProduct);
        expect(result.dataValues).toEqual(wishProduct.dataValues);
        
    })

    it("Test-findAll should be able to find all ratingProducts", async () => {
        
        for (let i=0;i<10;i++){
            const wishProduct = new WishProduct({
                productId: getRandomInt(0,100),
                ownerId: getRandomInt(0,100),
                quantity: getRandomInt(0,100),
            })
            await wishProduct.save()
        }
        expect(async () => await WishProduct.findAll()).not.toThrow(Error)
        const result = await WishProduct.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
    })

    it("Test-save should conflit if productId and name are the same", async () => {
        const wishProduct = new WishProduct({
            productId: getRandomInt(0,100),
            ownerId: getRandomInt(0,100),
            quantity: getRandomInt(0,100),
        })
        const wishProduct2 = new WishProduct({
            productId: wishProduct.productId,
            ownerId: wishProduct.ownerId,
            quantity: getRandomInt(0,100),
        })
        expect(async () => await wishProduct.save().not.toThrow(UniqueConstraintError))
        expect(async() => await wishProduct2.save().toThrow(UniqueConstraintError))

    })

    it("Test-save should not conflit if productId or ownerId are different", async () => {
        const id = getRandomInt(0,100)
        const ownerId = getRandomInt(0,100)
        const wishProduct = new RatingProduct({
            productId: id,
            ownerId: ownerId,
            quantity: getRandomInt(0,100),
        })
        const wishProduct2 = new RatingProduct({
            productId: id+1,
            ownerId: ownerId,
            quantity: getRandomInt(0,100),
        })
        const wishProduct3 = new RatingProduct({
            productId: id,
            ownerId: ownerId+1,
            quantity: getRandomInt(0,100),
        })
        expect(async() => await wishProduct.save().not.toThrow(UniqueConstraintError))
        expect(async() => await wishProduct2.save().not.toThrow(UniqueConstraintError))
        expect(async() => await wishProduct3.save().not.toThrow(UniqueConstraintError))
    })



})














