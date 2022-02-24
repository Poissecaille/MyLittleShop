'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING(50), allowNull: false
      },
      lastName: {
        type: Sequelize.STRING(50), allowNull: false
      },
      username: {
        type: Sequelize.STRING(50), allowNull: false, unique: true
      },
      email: {
        type: Sequelize.STRING, unique: true, allowNull: false
      },
      password: {
        type: Sequelize.STRING, allowNull: false
      },
      birthDate: {
        type: Sequelize.DATEONLY, allowNull: false
      },
      role: {
        type: Sequelize.ENUM(["buyer", "seller", "admin"]), allowNull: false, defaultValue: "buyer"
      },
      activated: {
        type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};