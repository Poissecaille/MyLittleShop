const request = require('supertest');
const app = require('../app');

var token;

describe('POST /users', () => {
  it('register with correct json and create buyer account', (done) => {
    request(app)
      .post('/register')
      .send({
        "email": "alexboury@etna-alternance.net",
        "userName": "alex",
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
        "userName": "alexx",
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
        "userName": "alex",
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
        "userName": "alex",
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

describe('POST /users', () => {
  it('correct login responds with json and token', (done) => {
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
        token = response.body.token
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

describe('POST /users', () => {
  it('deactivate responds with json and user is deactivated', (done) => {
    console.log("TOKKKK",token)
    request(app)
      .put('/deactivate')
      .send({
        "email": "alexboury@etna-alternance.net",
        "password": "alpha"
      })
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Account deleted");
        done();
      })
      .catch(err => done(err))
  });
  it('responds with failure when deactivate another time the same account', (done) => {
    request(app)
      .put('/deactivate')
      .send({
        "email": "alexboury@etna-alternance.net",
        "password": "alpha"
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Account closed");
        done();
      })
      .catch(err => done(err))
  });
  it('responds with failure when no token is in the header', (done) => {
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
})