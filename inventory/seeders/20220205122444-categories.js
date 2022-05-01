'use strict';
const now = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('productCategory', [{
      name: 'computer/electronic',
      productId: 1,
      created_at: now,
      updated_at: now
    },
    {
      name: 'textiles',
      productId: 2,
      created_at: now,
      updated_at: now
    },
    {
      name: 'textiles',
      productId: 3,
      created_at: now,
      updated_at: now
    },
    {
      name: 'textiles',
      productId: 4,
      created_at: now,
      updated_at: now
    },
    {
      name: 'jewels',
      productId: 5,
      created_at: now,
      updated_at: now
    },
    {
      name: 'jewels',
      productId: 6,
      created_at: now,
      updated_at: now
    },
    {
      name: 'jewels',
      productId: 7,
      created_at: now,
      updated_at: now
    },
    {
      name: 'jewels',
      productId: 8,
      created_at: now,
      updated_at: now
    },
    {
      name: 'computer/electronic',
      productId: 9,
      created_at: now,
      updated_at: now
    },
    {
      name: 'computer/electronic',
      productId: 10,
      created_at: now,
      updated_at: now
    },
    {
      name: 'computer/electronic',
      productId: 11,
      created_at: now,
      updated_at: now
    },
    {
      name: 'gaming/electronic',
      productId: 12,
      created_at: now,
      updated_at: now
    },
    {
      name: 'computer/electronic',
      productId: 13,
      created_at: now,
      updated_at: now
    },
    {
      name: 'computer/electronic',
      productId: 14,
      created_at: now,
      updated_at: now
    },
    {
      name: 'textiles',
      productId: 15,
      created_at: now,
      updated_at: now
    },
    {
      name: 'textiles',
      productId: 16,
      created_at: now,
      updated_at: now
    },
    {
      name: 'textiles',
      productId: 17,
      created_at: now,
      updated_at: now
    },
    {
      name: 'textiles',
      productId: 18,
      created_at: now,
      updated_at: now
    },
    {
      name: 'textiles',
      productId: 19,
      created_at: now,
      updated_at: now
    },
    {
      name: 'textiles',
      productId: 20,
      created_at: now,
      updated_at: now
    }]);
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('productCategory', null, {});
  }

};
