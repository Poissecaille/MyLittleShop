'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('cartProduct', [{
      ownerId: 1,
      productId: 2,
      quantity: 2,
      created_at: "2022-02-05 17:00:00",
      updated_at: "2022-02-05 17:00:00",
    },
    {
      ownerId: 2,
      productId: 1,
      quantity: 1,
      created_at: "2022-02-05 17:00:00",
      updated_at: "2022-02-05 17:00:00",
    }
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('cartProduct', null, {});
  }

};
