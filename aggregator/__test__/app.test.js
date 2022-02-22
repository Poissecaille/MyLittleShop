const request = require('supertest');
const app = require('../app');

describe('POST /users', function() {
    it('responds with json', function(done) {
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
        .end(function(err, res) {
          if (err) return done(err);
          return done();
        });
    });
  });
// describe("POST /register",() => {
//         it("return status code 200 with complete json", async (done)=>{
//             const res = await request(app)
//             .post("/register")
//             .set('Accept', 'application/json')
//             .send({
//                 "email": "alexboury@etna-alternance.net",
//                 "userName": "alex",
//                 "firstName": "Alex",
//                 "lastName": "Boury",
//                 "password": "alpha",
//                 "birthDate": "1994-03-31",
//                 "role": "buyer"
//             });
//             expect(res.status).toEqual(409);
//         });
//     });



// const request = require('supertest');
// const assert = require('assert');
// const express = require('express');

// // const app = express();
// // app.listen(5000)
// app.post("/register/",(req, res)=>{
// res.send({
//     "email": "alexboury@etna-alternance.net",
//     "userName": "alex",
//     "firstName": "Alex",
//     "lastName": "Boury",
//     "password": "alpha",
//     "birthDate": "1994-03-31",
//     "role": "buyer"
// })
// });
// // app.get('/user', function(req, res) {
// //     res.status(200).json({ name: 'john' });
// //   });
  
// //   request(app)
// //     .get('/user')
// //     .expect('Content-Type', /json/)
// //     .expect('Content-Length', '15')
// //     .expect(200)
// //     .end(function(err, res) {
// //       if (err) throw err;
// //     });