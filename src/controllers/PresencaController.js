const { Embarque, Passageiro } = require('../models');

const PresencaController = {
  /**
   * Lista todos os registros de embarque (presenças).
   * Inclui os dados do passageiro associado a cada embarque.
   */
  async listarTodas(req, res) {
    try {
      const presencas = await Embarque.findAll({
        order: [['createdAt', 'DESC']],
        include: {
          model: Passageiro,
          as: 'passageiro',
          attributes: ['nome'] 
        }
      });

      res.status(200).json(presencas);
    } catch (error) {
      console.error("Erro em PresencaController.listarTodas:", error);
      res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  },
};

module.exports = PresencaController;
