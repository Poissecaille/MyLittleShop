'use strict';

const now = new Date(Date.now()).toISOString().slice(0, 19).replace('T', ' ')


module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('productTag', [{
      name: "Laptop",
      productId: 1,
      created_at: now,
      updated_at: now
    },
    {
      name: "T-shirt",
      productId: 2,
      created_at: now,
      updated_at: now
    },
    {
      name: "Slim",
      productId: 2,
      created_at: now,
      updated_at: now
    },
    {
      name: "Mens",
      productId: 2,
      created_at: now,
      updated_at: now
    },
    {
      name: "jacket",
      productId: 3,
      created_at: now,
      updated_at: now
    },
    {
      name: "Mens",
      productId: 3,
      created_at: now,
      updated_at: now
    },
    {
      name: "Cotton",
      productId: 3,
      created_at: now,
      updated_at: now
    },
    {
      name: "Slim",
      productId: 4,
      created_at: now,
      updated_at: now
    },
    {
      name: "Mens",
      productId: 4,
      created_at: now,
      updated_at: now
    },
    {
      name: "Bracelet",
      productId: 5,
      created_at: now,
      updated_at: now
    },
    {
      name: "Gold",
      productId: 5,
      created_at: now,
      updated_at: now
    },
    {
      name: "Silver",
      productId: 5,
      created_at: now,
      updated_at: now
    },
    {
      name: "Gold",
      productId: 5,
      created_at: now,
      updated_at: now
    },
    {
      name: "Bracelet",
      productId: 5,
      created_at: now,
      updated_at: now
    },
    {
      name: "Gold",
      productId: 6,
      created_at: now,
      updated_at: now
    },
    {
      name: "Micropave",
      productId: 6,
      created_at: now,
      updated_at: now
    },
    {
      name: "Ring",
      productId: 7,
      created_at: now,
      updated_at: now
    },
    {
      name: "White Gold",
      productId: 7,
      created_at: now,
      updated_at: now
    },
    {
      name: "Necklace",
      productId: 8,
      created_at: now,
      updated_at: now
    },
    {
      name: "Gold",
      productId: 8,
      created_at: now,
      updated_at: now
    },
    {
      name: "HardDisk",
      productId: 9,
      created_at: now,
      updated_at: now
    },
    {
      name: "HD",
      productId: 9,
      created_at: now,
      updated_at: now
    },
    {
      name: "USB 3.0",
      productId: 9,
      created_at: now,
      updated_at: now
    },
    {
      name: "HardDisk",
      productId: 10,
      created_at: now,
      updated_at: now
    },
    {
      name: "SSD",
      productId: 10,
      created_at: now,
      updated_at: now
    },
    {
      name: "HardDisk",
      productId: 11,
      created_at: now,
      updated_at: now
    },
    {
      name: "SSD",
      productId: 11,
      created_at: now,
      updated_at: now
    },
    {
      name: "HardDisk",
      productId: 12,
      created_at: now,
      updated_at: now
    },
    {
      name: "Gaming",
      productId: 12,
      created_at: now,
      updated_at: now
    },
    {
      name: "Laptop",
      productId: 13,
      created_at: now,
      updated_at: now
    },
    {
      name: "Acer",
      productId: 13,
      created_at: now,
      updated_at: now
    },
    {
      name: "Full HD",
      productId: 13,
      created_at: now,
      updated_at: now
    },
    {
      name: "Monitor",
      productId: 14,
      created_at: now,
      updated_at: now
    },
    {
      name: "Gaming",
      productId: 14,
      created_at: now,
      updated_at: now
    },
    {
      name: "Samsung",
      productId: 14,
      created_at: now,
      updated_at: now
    },
    {
      name: "Jacket",
      productId: 15,
      created_at: now,
      updated_at: now
    },
    {
      name: "Winter",
      productId: 15,
      created_at: now,
      updated_at: now
    },
    {
      name: "Women",
      productId: 15,
      created_at: now,
      updated_at: now
    },
    {
      name: "Jacket",
      productId: 16,
      created_at: now,
      updated_at: now
    },
    {
      name: "Women",
      productId: 16,
      created_at: now,
      updated_at: now
    },
    {
      name: "Leather",
      productId: 16,
      created_at: now,
      updated_at: now
    },
    {
      name: "Jacket",
      productId: 17,
      created_at: now,
      updated_at: now
    },
    {
      name: "Women",
      productId: 17,
      created_at: now,
      updated_at: now
    },
    {
      name: "Raincoats",
      productId: 17,
      created_at: now,
      updated_at: now
    },
    {
      name: "Short",
      productId: 18,
      created_at: now,
      updated_at: now
    },
    {
      name: "Women",
      productId: 18,
      created_at: now,
      updated_at: now
    },
    {
      name: "Short",
      productId: 19,
      created_at: now,
      updated_at: now
    },
    {
      name: "Women",
      productId: 19,
      created_at: now,
      updated_at: now
    },
    {
      name: "Sleeve",
      productId: 19,
      created_at: now,
      updated_at: now
    },
    {
      name: "T-shirt",
      productId: 20,
      created_at: now,
      updated_at: now
    },
    {
      name: "Cotton",
      productId: 20,
      created_at: now,
      updated_at: now
    },
    {
      name: "Womens",
      productId: 20,
      created_at: now,
      updated_at: now
    },
    {
      name: "DANVOUY",
      productId: 20,
      created_at: now,
      updated_at: now
    }
    ]);
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('productTag', null, {});
  }


};