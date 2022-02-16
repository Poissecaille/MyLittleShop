'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('productTag', [{
      name: "mariokart"
    }]);
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('productTag', null, {});
  }


};