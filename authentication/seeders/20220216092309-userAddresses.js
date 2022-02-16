'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('userAddress', [{
      userId: 1,
      address1: "mario",
      address2: "10 mushrooms avenue",
      address3: null,
      city: "taod town",
      region: "cheep cheep beach",
      country: "mushroom kingdom",
      postalCode: 12345,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00"
    }, {
      userId: 1,
      address1: "mario",
      address2: "5 flowers road",
      address3: "2nd floor",
      city: "taod town",
      region: "cheep cheep beach",
      country: "mushroom kingdom",
      postalCode: 12345,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00"
    }, {
      userId: 2,
      address1: "luigi",
      address2: "1 mushroom street",
      address3: null,
      city: "koopa town",
      region: "goomba palace",
      country: "bowser kingdom",
      postalCode: 12345,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00"
    },
    ])
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('userAddress', null, {});
  }
};

