const request = require('supertest');
const app = require('../app');

describe('POST /users', () => {
  it('responds with json', (done) => {
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
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
  it('conflict with already existant data', (done) => {
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
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});
