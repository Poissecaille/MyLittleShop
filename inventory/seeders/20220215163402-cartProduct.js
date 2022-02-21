'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('cartProduct', [{
      sellerId: 1,
      productId: 2,
      quantity: 2,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    },
    {
      sellerId: 2,
      productId: 1,
      quantity: 1,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    }
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('cartProduct', null, {});
  }

};
