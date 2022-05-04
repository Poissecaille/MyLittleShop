'use strict';
const CryptoJS = require("crypto-js")
const env = require("dotenv").config();
const pass = CryptoJS.AES.encrypt(process.env.ADMIN_PASSWORD, process.env.PASSWORD_SECRET).toString()
const passSeller = CryptoJS.AES.encrypt(process.env.SELLER_PASSWORD, process.env.PASSWORD_SECRET).toString()
const passBuyer = CryptoJS.AES.encrypt(process.env.BUYER_PASSWORD, process.env.PASSWORD_SECRET).toString()

const now = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [{
      email: "admin@hotmail.fr",
      firstname: "admin",
      lastname: "admin",
      username: "admin",
      password: pass,
      birthdate: "01/01/1970",
      role: "admin",
      activated: true,
      created_at: now,
      updated_at: now
    },
    {
      email: "seller@hotmail.fr",
      firstname: "seller",
      lastname: "seller",
      username: "seller",
      password: passSeller,
      birthdate: "01/01/1970",
      role: "seller",
      activated: true,
      created_at: now,
      updated_at: now
    },
    {
      email: "alexboury@hotmail.fr",
      firstname: "alex",
      lastname: "boury",
      username: "alex",
      password: passBuyer,
      birthdate: "03/31/1994",
      role: "buyer",
      activated: true,
      created_at: now,
      updated_at: now
    },
    {
      email: "rayaneserir@hotmail.fr",
      firstname: "rayane",
      lastname: "serir",
      username: "rayane",
      password: passBuyer,
      birthdate: "06/27/1997",
      role: "buyer",
      activated: true,
      created_at: now,
      updated_at: now
    }
    ])
  }, async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  }

};
