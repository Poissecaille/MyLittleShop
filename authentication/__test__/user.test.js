const app = require('../app'); //important
const {
  sequelizeTest
} = require("../settings/database")
const request = require('supertest');
const {
  faker
} = require('@faker-js/faker');


const db = sequelizeTest

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
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      birthDate: faker.date.past(),
      role: "buyer",
    }
    request(app)
      .post('/api/register')
      .send({
        "email": fakePerson.email,
        "username": fakePerson.username,
        "firstName": fakePerson.firstName,
        "lastName": fakePerson.lastName,
        "password": fakePerson.password,
        "birthDate": fakePerson.birthDate,
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
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      birthDate: faker.date.past(),
      role: "buyer",
    }
    request(app)
      .post('/api/register')
      .send({
        "email": faker.internet.email(),
        "username": fakePerson.username,
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "password": faker.internet.password(),
        "birthDate": faker.date.past(),
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
        "firstName": fakePerson.firstName,
        "lastName": fakePerson.lastName,
        "password": fakePerson.password,
        "birthDate": fakePerson.birthDate,
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
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      birthDate: faker.date.past(),
      role: "buyer",
    }
    request(app)
      .post('/api/register')
      .send({
        "email": fakePerson.email,
        "username": faker.internet.userName(),
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "password": faker.internet.password(),
        "birthDate": faker.date.past(),
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
        "firstName": fakePerson.firstName,
        "lastName": fakePerson.lastName,
        "password": fakePerson.password,
        "birthDate": fakePerson.birthDate,
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