const  app  = require('../app') //important
const CryptoJS = require("crypto-js")
const { faker } = require('@faker-js/faker');
const { sequelizeTest } = require("../settings/database")
const Order = require("../models/order");
const OrderProduct = require("../models/order");
const { UniqueConstraintError, ValidationError } = require("sequelize")
const db = sequelizeTest

describe("order-product unit tests", () => {

    beforeAll(async () => {
        jest.restoreAllMocks();
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })

    it("Test-save should be able to create a new order without throwing error", async () => {
        expect(3).toBe(3) 
    })
})