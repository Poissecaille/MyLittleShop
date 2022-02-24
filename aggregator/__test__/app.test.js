const request = require('supertest');
const app = require('../app');

var buyerToken;
var sellerToken;
var sellerName;

describe('POST /register', () => {
  it('register with correct json and create buyer account', (done) => {
    request(app)
      .post('/register')
      .send({
        "email": "alexboury@etna-alternance.net",
        "username": "alex",
        "firstName": "Alex",
        "lastName": "Boury",
        "password": "alpha",
        "birthDate": "1994-03-31",
        "role": "buyer"
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
  it('register with correct json and create seller account', (done) => {
    request(app)
      .post('/register')
      .send({
        "email": "alexxboury@etna-alternance.net",
        "username": "alexx",
        "firstName": "Alex",
        "lastName": "Boury",
        "password": "beta",
        "birthDate": "1994-03-31",
        "role": "seller"
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
  it('register conflict with already existant data', (done) => {
    request(app)
      .post('/register')
      .send({
        "email": "alexboury@etna-alternance.net",
        "username": "alex",
        "firstName": "Alex",
        "lastName": "Boury",
        "password": "alpha",
        "birthDate": "1994-03-31",
        "role": "buyer"
      })
      .set('Accept', 'application/json')
      .expect(409)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("User already existant");
        done();
      });
  });
  it('register lack json data', (done) => {
    request(app)
      .post('/register')
      .send({
        "username": "alex",
        "firstName": "Alex",
        "lastName": "Boury",
        "password": "alpha",
        "birthDate": "1994-03-31",
        "role": "buyer"
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Bad json format");
        done();
      });
  });
});

describe('POST /login', () => {
  it('correct buyer login responds with json and token', (done) => {
    request(app)
      .post('/login')
      .send({
        "email": "alexboury@etna-alternance.net",
        "password": "alpha"
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Logged in");
        expect(response.body.token).toBeDefined();
        buyerToken = response.body.token
        done();
      })
      .catch(err => done(err))
  });
  it('correct seller login responds with json and token', (done) => {
    request(app)
      .post('/login')
      .send({
        "email": "alexxboury@etna-alternance.net",
        "password": "beta"
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Logged in");
        expect(response.body.token).toBeDefined();
        sellerToken = response.body.token
        done();
      })
      .catch(err => done(err))
  });
  it('correct login responds with json and token', (done) => {
    request(app)
      .post('/login')
      .send({
        "email": "alexxboury@etna-alternance.net",
        "password": "beta"
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Logged in");
        expect(response.body.token).toBeDefined();
        done();
      })
      .catch(err => done(err))
  });
  it('login lack json data', (done) => {
    request(app)
      .post('/login')
      .send({
        "email": "alexboury@etna-alternance.net",
        "password": null
      })
      .set('Accept', 'application/json')
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Bad json format");
        expect(response.body.token).toBeUndefined();
        done();
      })
      .catch(err => done(err))
  });
  it('login twice responds again with json and token', (done) => {
    request(app)
      .post('/login')
      .send({
        "email": "alexboury@etna-alternance.net",
        "password": "alpha"
      })
      .set('Accept', 'application/json')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Logged in");
        expect(response.body.token).toBeDefined();
        done();
      })
      .catch(err => done(err))
  });
  it('login wrong password', (done) => {
    request(app)
      .post('/login')
      .send({
        "email": "alexboury@etna-alternance.net",
        "password": "wrong_password"
      })
      .set('Accept', 'application/json')
      .expect(403)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Bad credentials");
        expect(response.body.token).toBeUndefined();
        done();
      })
      .catch(err => done(err))
  });
  it('login wrong email', (done) => {
    request(app)
      .post('/login')
      .send({
        "email": "alexxxboury@etna-alternance.net",
        "password": "beta"
      })
      .set('Accept', 'application/json')
      .expect(404)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("No user found");
        expect(response.body.token).toBeUndefined();
        done();
      })
      .catch(err => done(err))
  });

});

describe('POST /deactivate', () => {
  it('deactivate responds with json and user is deactivated', (done) => {
    request(app)
      .put('/deactivate')
      .send({
        "email": "alexboury@etna-alternance.net",
        "password": "alpha"
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Account deleted");
        done();
      })
      .catch(err => done(err))
  });
  it('deactivate responds with failure when deactivate another time the same account', (done) => {
    request(app)
      .put('/deactivate')
      .send({
        "email": "alexboury@etna-alternance.net",
        "password": "alpha"
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(403)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Account closed");
        done();
      })
      .catch(err => done(err))
  });
  it('deactivate responds with failure when no token is in the header', (done) => {
    request(app)
      .put('/deactivate')
      .send({
        "email": "alexboury@etna-alternance.net",
        "password": "alpha"
      })
      .set('Accept', 'application/json')
      .expect(401)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Unauthorized");
        done();
      })
      .catch(err => done(err))
  });
  it('deactivate responds with failure when token is wrong', (done) => {
    request(app)
      .put('/deactivate')
      .send({
        "email": "random@etna-alternance.net",
        "password": "alpha"
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer token`)
      .expect(403)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Invalid token");
        done();
      })
      .catch(err => done(err))
  });
});

describe('POST /product', () => {
  it('correctly add product to the catalog responds with json', (done) => {
    request(app)
      .post('/product')
      .send({
        "name": "product1",
        "label": "testProduct",
        "condition": "new",
        "description": "nice product",
        "unitPrice": 10.99,
        "availableQuantity": 5
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("New product added");
        done();
      })
      .catch(err => done(err))
  });
  it('add product responds with failure when add twice the same product for the same user', (done) => {
    request(app)
      .post('/product')
      .send({
        "name": "product1",
        "label": "testProduct",
        "condition": "new",
        "description": "nice product",
        "unitPrice": 10.99,
        "availableQuantity": 5
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(409)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Product already existant for current user");
        done();
      })
      .catch(err => done(err))
  });
  it('add product successfully add another product', (done) => {
    request(app)
      .post('/product')
      .send({
        "name": "product2",
        "label": "testProduct",
        "condition": "new",
        "description": "nice product",
        "unitPrice": 100.99,
        "availableQuantity": 10
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("New product added");
        done();
      })
      .catch(err => done(err))
  });
  it('add product response with failure when using a buyer token', (done) => {
    request(app)
      .post('/product')
      .send({
        "name": "product1",
        "label": "testProduct",
        "condition": "new",
        "description": "nice product",
        "unitPrice": 100.99,
        "availableQuantity": 10
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(403)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Forbidden action");
        done();
      })
      .catch(err => done(err))
  });
  it('add product response with failure lack json data', (done) => {
    request(app)
      .post('/product')
      .send({
        "name": "product1",
        "label": "testProduct",
        "condition": "new",
        "description": "nice product",
        "unitPrice": 100.99,
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Bad json format");
        done();
      })
      .catch(err => done(err))
  });
  it('add product response with failure wrong enum value', (done) => {
    request(app)
      .post('/product')
      .send({
        "name": "product1",
        "label": "testProduct",
        "condition": "good",
        "description": "nice product",
        "unitPrice": 100.99,
        "availableQuantity": 10
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Bad json format");
        done();
      })
      .catch(err => done(err))
  });
});
describe('GET /products', () => {
  it('get seller products response with json', (done) => {
    request(app)
      .get('/products')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${sellerToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toBeDefined();
        done();
      })
      .catch(err => done(err))
  });
  it('buyer get products response with json', (done) => {
    request(app)
      .get('/products')
      .set('Accept', 'application/json')
      .query({
        "condition": "new",
        "lowerPrice": 0,
        "higherPrice": 200,
        "filter": "unitPrice"
      })
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        console.log(response.body.response)
        expect(response.body.response).toBeDefined();
        done();
      })
      .catch(err => done(err))
  });
})
