'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('product', [{
      name: "baby mario stroller",
      label: "nintendo",
      condition: "new",
      description: "Chomp inside",
      unitPrice: 100.0,
      availableQuantity: 3,
      productCategoryId: 1,
      productTagId: 1,
      ownerId: 4,
      onSale: true,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    },
    {
      name: "baby luigi stroller",
      label: "nintendo",
      condition: "occasion",
      description: "Chomp inside",
      unitPrice: 99.0,
      availableQuantity: 3,
      productCategoryId: 1,
      productTagId: 1,
      ownerId: 4,
      onSale: false,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    },
    {
      name: "baby yoshi stroller",
      label: "nintendo",
      condition: "new",
      description: "Chomp inside",
      unitPrice: 50.0,
      availableQuantity: 10,
      productCategoryId: 1,
      productTagId: 1,
      ownerId: 4,
      onSale: true,
      createdAt: "2022-02-05 17:00:00",
      updatedAt: "2022-02-05 17:00:00",
    }
    ])
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('product', null, {});
  }

};
