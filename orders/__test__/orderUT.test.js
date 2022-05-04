const  app  = require('../app') //important
const CryptoJS = require("crypto-js")
const { faker } = require('@faker-js/faker');
const { sequelizeTest } = require("../settings/database")
const Order = require("../models/order");
const OrderProduct = require("../models/orderProduct")
const { UniqueConstraintError, ValidationError } = require("sequelize")
const db = sequelizeTest
const getRandomInt = require('../utils/utils');

describe("order-OrderProduct unit tests", () => {

    beforeAll(async () => {
        jest.restoreAllMocks();
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })
    const deliveryStatus = ["preparation", "shipped", 'delivred']
    it("Test-save should be able to create a new OrderProduct without throwing error", async () => {
        const orderProduct = new OrderProduct({
            ownerId: getRandomInt(0,100),
            productId:getRandomInt(0,100),
            addressId:getRandomInt(0,100),
            quantity:getRandomInt(0,100),
            shipped: deliveryStatus[getRandomInt(0,3)]
        })
        expect(async () => await orderProduct.save().not.toThrow(ValidationError)) 

    })


    it("Test-findOne should be able to find the correct OrderProduct",async () => {
        const orderProduct = new OrderProduct({
            ownerId: getRandomInt(0,100),
            productId:getRandomInt(0,100),
            addressId:getRandomInt(0,100),
            quantity:getRandomInt(0,100),
            shipped: deliveryStatus[getRandomInt(0,3)]
        })
        await orderProduct.save()


        const result = await OrderProduct.findOne({
            where: {
                ownerId: orderProduct.ownerId,
                productId: orderProduct.productId,
                addressId: orderProduct.addressId
            }
        });
        expect(result).toBeInstanceOf(OrderProduct);
        expect(result.dataValues).toEqual(orderProduct.dataValues);
        
    })

    it("Test-findAll should be able to find all OrderProducts", async () => {
        for (let i=0;i<10;i++){
            const orderProduct = new OrderProduct({
                ownerId: getRandomInt(0,100),
                productId:getRandomInt(0,100),
                addressId:getRandomInt(0,100),
                quantity:getRandomInt(0,100),
                shipped: deliveryStatus[getRandomInt(0,3)]
            })
            await orderProduct.save()
        }
        expect(async () => await OrderProduct.findAll()).not.toThrow(Error)
        const result = await OrderProduct.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
        
    })
})

describe("order-Order unit tests", () => {

    beforeAll(async () => {
        jest.restoreAllMocks();
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })

    it("Test-save should be able to create a new order without throwing error", async () => {
        const order = new Order({
            ownerId: getRandomInt(0,100),
            userAddress:faker.address.streetAddress(),
            value:getRandomInt(0,100),
        })
        expect(async () => await order.save().not.toThrow(ValidationError)) 

    })


    it("Test-findOne should be able to find the correct OrderProduct",async () => {
        const order = new Order({
            ownerId: getRandomInt(0,100),
            userAddress:faker.address.streetAddress(),
            value:getRandomInt(0,100),
        })
        await order.save()


        const result = await Order.findOne({
            where: {
                ownerId: order.ownerId,
                userAddress:order.userAddress

            }
        });
        expect(result).toBeInstanceOf(Order);
        expect(result.dataValues).toEqual(order.dataValues);
        
    })

    it("Test-findAll should be able to find all OrderProducts", async () => {
        for (let i=0;i<10;i++){
            const order = new Order({
                ownerId: getRandomInt(0,100),
                userAddress:faker.address.streetAddress(),
                value:getRandomInt(0,100),
            })
            await order.save()
        }
        expect(async () => await Order.findAll()).not.toThrow(Error)
        const result = await Order.findAll();
        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(10);
        
    })
})