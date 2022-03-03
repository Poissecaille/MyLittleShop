'use strict';
const CryptoJS = require("crypto-js")
const env = require("dotenv").config();
const pass = CryptoJS.AES.encrypt(process.env.ADMIN_PASSWORD, process.env.PASSWORD_SECRET).toString()
const now = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [{
      email: "admin@hotmail.fr",
      firstName: "admin",
      lastName: "admin",
      username: "admin",
      password: pass,
      birthDate: "01/01/1970",
      role: "admin",
      activated: true,
      createdAt: now,
      updatedAt: now
    },
    ])
  }, async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  }

};
