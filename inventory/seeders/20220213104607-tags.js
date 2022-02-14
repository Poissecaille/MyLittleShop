'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('productTag', [{
      name: "mariokart"
    }]);
  },


};