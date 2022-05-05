const app = require('../app'); //important
const {sequelizeTest} = require("../settings/database")
const request = require('supertest');
const {faker} = require('@faker-js/faker');
const User = require("../models/user");
const CryptoJS = require("crypto-js")
const db = sequelizeTest;
const execSync = require('child_process').execSync;
afterAll(async () => {
  await db.sync({
    force: true
  }).then(
    () => {
        execSync('npx sequelize-cli  db:seed --seed 20220212150215-users.js', { encoding: 'utf-8' });
    })
});


describe("POST /api/register", () => {
  beforeAll(async () => {
    jest.restoreAllMocks();
  })

  beforeEach(async () => {
    await db.sync({
      force: true
    })
  })

  it('register with correct data and create buyer account', (done) => {
    const fakePerson = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      birthdate: faker.date.past(),
      role: "buyer",
    }
    request(app)
      .post('/api/register')
      .send({
        "email": fakePerson.email,
        "username": fakePerson.username,
        "firstname": fakePerson.firstname,
        "lastname": fakePerson.lastname,
        "password": fakePerson.password,
        "birthdate": fakePerson.birthdate,
        "role": fakePerson.role
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Signed in");
        done();
      })
      .catch(err => done(err))
  });
  it('register violate unique username constraint', (done) => {
    const fakePerson = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      birthdate: faker.date.past(),
      role: "buyer",
    }
    request(app)
      .post('/api/register')
      .send({
        "email": faker.internet.email(),
        "username": fakePerson.username,
        "firstname": faker.name.firstName(),
        "lastname": faker.name.lastName(),
        "password": faker.internet.password(),
        "birthdate": faker.date.past(),
        "role": fakePerson.role
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Signed in");
        done();
      })

      request(app)
      .post('/api/register')
      .send({
        "email": fakePerson.email,
        "username": fakePerson.username,
        "firstname": fakePerson.firstname,
        "lastname": fakePerson.lastname,
        "password": fakePerson.password,
        "birthdate": fakePerson.birthdate,
        "role": fakePerson.role
      })
      .set('Accept', 'application/json')
      .expect(409)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Username or email already used");
        done();
      })
  });
  it('register violate unique email constraint', (done) => {
    const fakePerson = {
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      birthdate: faker.date.past(),
      role: "buyer",
    }
    request(app)
      .post('/api/register')
      .send({
        "email": fakePerson.email,
        "username": faker.internet.userName(),
        "firstname": faker.name.firstName(),
        "lastname": faker.name.lastName(),
        "password": faker.internet.password(),
        "birthdate": faker.date.past(),
        "role": fakePerson.role
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Signed in");
        done();
      })

      request(app)
      .post('/api/register')
      .send({
        "email": fakePerson.email,
        "username": fakePerson.username,
        "firstname": fakePerson.firstname,
        "lastname": fakePerson.lastname,
        "password": fakePerson.password,
        "birthdate": fakePerson.birthdate,
        "role": fakePerson.role
      })
      .set('Accept', 'application/json')
      .expect(409)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Username or email already used");
        done();
      })
  });
  
  

  






});