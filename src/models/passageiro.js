'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Passageiro extends Model {
    static associate(models) {
      this.hasMany(models.Embarque, { foreignKey: 'passageiro_id', as: 'embarques' });
    }
  }
  Passageiro.init({
    nome: DataTypes.STRING,
    rfid_tag: { type: DataTypes.STRING, unique: true, allowNull: false },
    autorizado: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { sequelize, modelName: 'Passageiro', tableName: 'passageiros' });
  return Passageiro;
};