const  app  = require('../app') //important
const CryptoJS = require("crypto-js")
const { faker } = require('@faker-js/faker');
const { sequelizeTest } = require("../settings/database")
const User = require("../models/user");
const parseDate = require('../utils/utils');
const UserAddress = require("../models/userAddress");


const db = sequelizeTest


describe("UserAddress unit tests", () => {

    beforeAll(async () => {
        jest.restoreAllMocks();
    })

    beforeEach(async () => {
        await db.sync({ force: true})
        
    })

    it("Test-save should be able to create a new address without throwing error", async () => {
        const fakePerson = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email : faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
            birthdate : faker.date.past(),
            role: "buyer",
            date: parseDate(new Date())
        }
        const user = new User({
            email: fakePerson.email,
            firstname: fakePerson.firstname,
            lastname: fakePerson.lastname,
            username: fakePerson.username,
            password: CryptoJS.AES.encrypt(fakePerson.password, process.env.PASSWORD_SECRET).toString(),
            birthdate: fakePerson.birthdate,
            role: fakePerson.role,
            createdAt: fakePerson.date,
            updatedAt: fakePerson.date
        })
        await user.save()

        const fakeAddress = {
            address1: faker.address.streetName(),
            address2: faker.address.secondaryAddress(),
            city: faker.address.city(),
            region: faker.address.county(),
            country : faker.address.country(),
            postalCode: faker.address.zipCode(),
        }
            
        const newUserAddress = new UserAddress({
            address1: fakeAddress.address1,
            address2: fakeAddress.address2,
            address3: null,
            city: faker.address.city,
            region: faker.address.region,
            country: faker.address.country,
            postalCode: faker.address.postalCode,
            userId: 1
        });
        
        expect(async () => await newUserAddress.save().not.toThrow(Error))  
    })

    it("Test-findOne should be able to get an address using userId", async () => {
        const fakePerson = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email : faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
            birthdate : faker.date.past(),
            role: "buyer",
            date: parseDate(new Date())
        }
        const user = new User({
            email: fakePerson.email,
            firstname: fakePerson.firstname,
            lastname: fakePerson.lastname,
            username: fakePerson.username,
            password: CryptoJS.AES.encrypt(fakePerson.password, process.env.PASSWORD_SECRET).toString(),
            birthdate: fakePerson.birthdate,
            role: fakePerson.role,
            createdAt: fakePerson.date,
            updatedAt: fakePerson.date
        })
        await user.save()

        const fakeAddress = {
            address1: faker.address.streetName(),
            address2: faker.address.secondaryAddress(),
            city: faker.address.city(),
            region: faker.address.county(),
            country : faker.address.country(),
            postalCode: faker.address.zipCode('#####'),
        }
            
        const newUserAddress = new UserAddress({
            address1: fakeAddress.address1,
            address2: fakeAddress.address2,
            address3: null,
            city: fakeAddress.city,
            region: fakeAddress.region,
            country: fakeAddress.country,
            postalCode: fakeAddress.postalCode,
            userId: 1
        });
        await newUserAddress.save();
        
        const address = await UserAddress.findOne({
            where: {
                userId: 1
            }
        });
        
        expect(address.dataValues).toEqual(newUserAddress.dataValues)
        




    })

    it("Test-findAll should be able to get all address using userId", async () => {
        const fakePerson = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email : faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
            birthdate : faker.date.past(),
            role: "buyer",
            date: parseDate(new Date())
        }
        const user = new User({
            email: fakePerson.email,
            firstname: fakePerson.firstname,
            lastname: fakePerson.lastname,
            username: fakePerson.username,
            password: CryptoJS.AES.encrypt(fakePerson.password, process.env.PASSWORD_SECRET).toString(),
            birthdate: fakePerson.birthdate,
            role: fakePerson.role,
            createdAt: fakePerson.date,
            updatedAt: fakePerson.date
        })
        await user.save()        
        for(let i =0; i<5;i++){
            await new UserAddress({
                address1: faker.address.streetName(),
                address2: faker.address.secondaryAddress(),
                address3: null,
                city: faker.address.city(),
                region: faker.address.county(),
                country: faker.address.county(),
                postalCode: faker.address.zipCode('#####'),
                userId: 1
            }).save();
        }
        
        
        const allAddress = await UserAddress.findAll({
            where: {
                userId: 1
            }
        });
        expect(allAddress.length).toBe(5)
        
    })

    it("Test-update should be able to modify address using userId", async () => {
        const fakePerson = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email : faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password(),
            birthdate : faker.date.past(),
            role: "buyer",
            date: parseDate(new Date())
        }
        const user = new User({
            email: fakePerson.email,
            firstname: fakePerson.firstname,
            lastname: fakePerson.lastname,
            username: fakePerson.username,
            password: CryptoJS.AES.encrypt(fakePerson.password, process.env.PASSWORD_SECRET).toString(),
            birthdate: fakePerson.birthdate,
            role: fakePerson.role,
            createdAt: fakePerson.date,
            updatedAt: fakePerson.date
        })
        await user.save()        
        const fakeAddress = {
            address1: faker.address.streetName(),
            address2: faker.address.secondaryAddress(),
            city: faker.address.city(),
            region: faker.address.county(),
            country : faker.address.country(),
            postalCode: faker.address.zipCode('#####'),
        }
            
        const newUserAddress = new UserAddress({
            address1: fakeAddress.address1,
            address2: fakeAddress.address2,
            address3: null,
            city: fakeAddress.city,
            region: fakeAddress.region,
            country: fakeAddress.country,
            postalCode: parseInt(fakeAddress.postalCode),
            userId: 1
        });
        await newUserAddress.save();

        newUserAddress.update({
            address1: fakeAddress.address1+"updated",
            address2: fakeAddress.address2+"updated",
            address3: null,
            city: fakeAddress.city+"updated",
            region: fakeAddress.city+"updated",
            country: fakeAddress.country+"updated",
            postalCode: parseInt(fakeAddress.postalCode)
        });

        await newUserAddress.save()
        const result = await UserAddress.findOne({
            where :{
                userId: 1,
                address1: fakeAddress.address1+"updated"
            }
        })
        expect(result.dataValues).toEqual(newUserAddress.dataValues)
    })
})