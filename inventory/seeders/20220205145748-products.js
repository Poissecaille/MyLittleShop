'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('product', [{
      name: "baby mario stroller",
      label: "nintendo",
      condition: "new",
      description: "Chomp inside",
      unit_price: 100.0,
      available_quantity: 1,
      productCategoryId: 1,
      productTagId: null,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    },
    {
      name: "baby luigi stroller",
      label: "nintendo",
      condition: "occasion",
      description: "Chomp inside",
      unit_price: 99.0,
      available_quantity: 1,
      productCategoryId: 1,
      productTagId: null,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    }
    ])
  },


};
