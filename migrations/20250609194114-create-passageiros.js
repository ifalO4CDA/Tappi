'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('passageiros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rfid_tag: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      autorizado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('passageiros');
  }
};