'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('productCategory', [{
      name: 'stroller',
    }]);
  },

};
