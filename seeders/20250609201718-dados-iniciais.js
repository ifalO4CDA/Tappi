'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('passageiros', [
      { nome: 'João Silva', rfid_tag: 'A1B2C3D4', autorizado: true, createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Maria Oliveira', rfid_tag: 'E5F6G7H8', autorizado: false, createdAt: new Date(), updatedAt: new Date() },
      { nome: 'Carlos Souza', rfid_tag: 'I9J0K1L2', autorizado: true, createdAt: new Date(), updatedAt: new Date() }
    ], {});
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('passageiros', null, {});
  }
};