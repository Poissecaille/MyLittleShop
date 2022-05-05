const request = require('supertest');
const {faker} = require('@faker-js/faker');
const app = require('../app');


const fakePerson = {
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  birthdate: faker.date.past(),
  role: "buyer",
}


describe("User tests", () => {

  describe('POST /register for buyers', () => {

    it('register with correct json and create buyer account', (done) => {
      request(app)
        .post('/register')
        .send({
          "email": fakePerson.email,
          "username": fakePerson.username,
          "firstname": fakePerson.firstname,
          "lastname": fakePerson.lastname,
          "password": fakePerson.password,
          "birthdate": fakePerson.birthdate,
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
          "email": fakePerson.email,
          "username": fakePerson.username,
          "firstname": fakePerson.firstname,
          "lastname": fakePerson.lastname,
          "password": fakePerson.password,
          "birthdate": fakePerson.birthdate,
        })
        .set('Accept', 'application/json')
        .expect(409)
        .expect('Content-Type', /json/)
        .then(response => {
          done();
        });
    });
  
    it('register lack json data email', (done) => {
      request(app)
        .post('/register')
        .send({
          "username": fakePerson.username,
          "firstname": fakePerson.firstname,
          "lastname": fakePerson.lastname,
          "password": fakePerson.password,
          "birthdate": fakePerson.birthdate,
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body.response).toEqual("Bad json format");
          done();
        });
    });
  
    it('register lack json data username', (done) => {
      request(app)
        .post('/register')
        .send({
          "email": fakePerson.email,
          "firstname": fakePerson.firstname,
          "lastname": fakePerson.lastname,
          "password": fakePerson.password,
          "birthdate": fakePerson.birthdate,
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
          "email": fakePerson.email,
          "password": fakePerson.password
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
  
    it('admin login responds with json and token', (done) => {
      request(app)
        .post('/login')
        .send({
          "email": process.env.ADMIN_EMAIL,
          "password": process.env.ADMIN_PASSWORD
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
  
    it('login with missing parameter password should fail', (done) => {
      request(app)
        .post('/login')
        .send({
          "email": fakePerson.email,
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Content-Type', /json/)
        .then(response => {
          done();
        })
        .catch(err => done(err))
    });
  
    it('login with missing parameter email should fail', (done) => {
      request(app)
        .post('/login')
        .send({
          "password": fakePerson.password
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect('Content-Type', /json/)
        .then(response => {
          done();
        })
        .catch(err => done(err))
    });
  
    it('login wrong password', (done) => {
      request(app)
        .post('/login')
        .send({
          "email": fakePerson.email,
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
          "email": "azdazfazf",
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
    var token = null;
    it('deactivate responds with json and user is deactivated', async () => {
      await request(app)
        .post('/login')
        .send({
          "email": fakePerson.email,
          "password": fakePerson.password
        })
        .set('Accept', 'application/json')
        .expect(200)
        .then(response => {
          token = response.body.token;
        })
      await request(app)
      .put('/deactivate')
      .send({
        "email": fakePerson.email,
        "password": fakePerson.password
      })
      .set('Accept', 'application/json')
      .set('authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Account deleted");
      })
    });
  
    
  }); 

})


describe("Address tests", () => {
  const fakePerson = {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    birthdate: faker.date.past(),
    role: "buyer",
  }
  var token = null;
  //Create user and get his login token
  beforeAll(async () => {
      await request(app)
      .post('/register')
      .send({
        "email": fakePerson.email,
        "username": fakePerson.username,
        "firstname": fakePerson.firstname,
        "lastname": fakePerson.lastname,
        "password": fakePerson.password,
        "birthdate": fakePerson.birthdate,
      })
      .set('Accept', 'application/json')
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.response).toEqual("Signed in");
      })

      await request(app)
      .post('/login')
      .send({
        "email": fakePerson.email,
        "password": fakePerson.password
      })
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        token = response.body.token;
      })     
  });

  it('create a new address with correct data', async () => {
      await request(app)
      .post('/userAddress')
      .send({
          "address1": "President Chirac",
          "address2": "2 Avenue Champs Elyses",
          "address3": null,
          "city": "Paris",
          "region": "Ile de France",
          "country": "FR",
          "postalCode": 75000
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
          expect(response.body.response).toEqual("New address added");
      })
  });
  it('create a second new address with correct data', async () => {
      await request(app)
      .post('/userAddress')
      .send({
          "address1": "President Obama",
          "address2": "1600 Pennsylvania Avenue NW",
          "address3": null,
          "city": "Washington",
          "region": "DC",
          "country": "US",
          "postalCode": 20500
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /json/)
      .then(response => {
          expect(response.body.response).toEqual("New address added");
      })
  });

  it('fails to add twice the same address for the same user', async () => {
      await request(app)
        .post('/userAddress')
        .send({
          "address1": "President Obama",
          "address2": "1600 Pennsylvania Avenue NW",
          "address3": null,
          "city": "Washington",
          "region": "DC",
          "country": "US",
          "postalCode": 20500
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(409)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body.response).toEqual("Address already existant for the current user");
        })
  });

  it('fails to add user address because of bad json format',  async () => {
  await request(app)
      .post('/userAddress')
      .send({
      "address2": "1600 Pennsylvania Avenue NW",
      "address3": null,
      "city": "Washington",
      "region": "DC",
      "country": "US",
      "postalCode": 20500
      })
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
      .expect('Content-Type', /json/)
      .then(response => {
      expect(response.body.response).toEqual("Bad json format");
      })
      .catch(err => err);
  });

  it('get addresses succeeds and responds with json', async()=> {
  await request(app)
      .get('/userAddresses')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
      expect(response.body.response).toBeDefined();
      })
      .catch(err => err);
  });


});










