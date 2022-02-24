'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [{
      email: "babymario@hotmail.fr",
      firstName: "baby",
      lastName: "mario",
      username: "star",
      password: "Chomp chomp",
      birthDate: "12/02/2022",
      role: "buyer",
      activated: true,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    },
    {
      email: "babyluigi@hotmail.fr",
      firstName: "baby",
      lastName: "luigi",
      username: "luigi",
      password: "Chomp chomp",
      birthDate: "12/02/2022",
      role: "admin",
      activated: true,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    }, {
      email: "babytaod@hotmail.fr",
      firstName: "baby",
      lastName: "taod",
      username: "taod",
      password: "Chomp chomp",
      birthDate: "12/02/2022",
      role: "buyer",
      activated: false,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    }, {
      email: "babyyoshi@hotmail.fr",
      firstName: "baby",
      username: "yoshi",
      lastName: "yoshi",
      password: "Chomp chomp",
      birthDate: "12/02/2022",
      role: "seller",
      activated: true,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    }
    ])
  }, async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  }

};
