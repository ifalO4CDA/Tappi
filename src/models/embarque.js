'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Embarque extends Model {
    static associate(models) {
      this.belongsTo(models.Passageiro, { foreignKey: 'passageiro_id', as: 'passageiro' });
    }
  }
  Embarque.init({
    // O ID do passageiro é definido pela associação
    passageiro_id: DataTypes.INTEGER
  }, { sequelize, modelName: 'Embarque', tableName: 'embarques' });
  return Embarque;
};