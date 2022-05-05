const  app  = require('../app') //important
const CryptoJS = require("crypto-js")
const { faker } = require('@faker-js/faker');
const { sequelizeTest } = require("../settings/database")
const parseDate = require('../utils/utils');
const User = require("../models/user");
const { UniqueConstraintError } = require("sequelize")
var difflib = require('difflib');
const env = require("dotenv").config();
const db = sequelizeTest

const execSync = require('child_process').execSync;
afterAll(async () => {
  await db.sync({
    force: true
  }).then(
    () => {
        execSync('npx sequelize-cli  db:seed --seed 20220212150215-users.js', { encoding: 'utf-8' });
    })
});
  



describe("Crypto unit tests", () => {
    it("Test-cryptoJs should be inconsistent with encrypting result" , () => {
        let secret = faker.random.alphaNumeric(5)
        let original = faker.random.alphaNumeric(10);
        let crypted = CryptoJS.AES.encrypt(original, secret).toString();
        let crypted_bis = CryptoJS.AES.encrypt(original, process.env.PASSWORD_SECRET).toString();
        expect(crypted).not.toEqual(crypted_bis)

    })
    it("Test-cryptoJs should be consistent with decrypting" , () => {
        let original = faker.random.alphaNumeric(10);
        let crypted = CryptoJS.AES.encrypt(original, process.env.PASSWORD_SECRET).toString();
        let decrypted = CryptoJS.AES.decrypt(crypted, process.env.PASSWORD_SECRET);
        let originalString = decrypted.toString(CryptoJS.enc.Utf8);
        expect(originalString).toEqual(original);
    })

    it("Test-cryptoJs should not give hints" , () => {
        let original = faker.random.alphaNumeric(10)
        let slightly_different = original+ faker.random.alphaNumeric(1)
        let crypted = CryptoJS.AES.encrypt(original, process.env.PASSWORD_SECRET).toString();
        let crypted2 = CryptoJS.AES.encrypt(slightly_different, process.env.PASSWORD_SECRET).toString();
        let ratio = new difflib.SequenceMatcher(null, crypted, crypted2);
        expect(ratio.ratio()).toBeLessThan(0.5);
    })

})


describe("Auth unit tests", () => {

    beforeAll(async () => {
        jest.restoreAllMocks();
    })

    beforeEach(async () => {
        await db.sync({ force: true})
    })


    it("Test-findOne Should return one correct user by email", async () => {
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
            username: fakePerson.username,
            firstname: fakePerson.firstname,
            lastname: fakePerson.lastname,
            password: CryptoJS.AES.encrypt(fakePerson.password, process.env.PASSWORD_SECRET).toString(),
            birthdate: fakePerson.birthdate,
            role: fakePerson.role,
            createdAt: fakePerson.date,
            updatedAt: fakePerson.date
        })
        await user.save()

        const result = await User.findOne({
            where: {
                email: fakePerson.email,
            }
        });
        expect(result).toBeInstanceOf(User);
        expect(result.dataValues).toEqual(user.dataValues);
    })

    it("Test-findOne Shouldn't return any user", async () => {
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

        const result = await User.findOne({
            where: {
                email: "nonsense@nonsense.nonsense",
            }
        });
        expect(result).toBeNull();
    })

    it("Test-Unicity conflict on email", async () => {
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

        const fakePerson2 = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email : fakePerson.email,
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

        const user2 = new User({
            email: fakePerson2.email,
            firstname: fakePerson2.firstname,
            lastname: fakePerson2.lastname,
            username: fakePerson2.username,
            password: CryptoJS.AES.encrypt(fakePerson2.password, process.env.PASSWORD_SECRET).toString(),
            birthdate: fakePerson2.birthdate,
            role: fakePerson2.role,
            createdAt: fakePerson2.date,
            updatedAt: fakePerson2.date
        })

        expect(async () => await user2.save().toThrow(UniqueConstraintError))       
    })

    it("Test-Unicity confilct on username", async () => {
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

        const fakePerson2 = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            email : faker.internet.email(),
            username: fakePerson.username,
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

        const user2 = new User({
            email: fakePerson2.email,
            firstname: fakePerson2.firstname,
            lastname: fakePerson2.lastname,
            username: fakePerson2.username,
            password: CryptoJS.AES.encrypt(fakePerson2.password, process.env.PASSWORD_SECRET).toString(),
            birthdate: fakePerson2.birthdate,
            role: fakePerson2.role,
            createdAt: fakePerson2.date,
            updatedAt: fakePerson2.date
        })

        expect(async () => await user2.save().toThrow(UniqueConstraintError))       
    })

    it("Test- findByPk should return one correct user",async () => {
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
        const result = await User.findByPk(1)
        expect(result.dataValues).toEqual(user.dataValues);
    })

})