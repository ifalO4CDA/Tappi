const { Embarque, Passageiro } = require('../models');

const PresencaController = {
  /**
   * Lista todos os registos de embarque (presenças) de forma paginada.
   * Inclui os dados do passageiro associado a cada embarque.
   */
  async listarTodas(req, res) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10; 
      const offset = (page - 1) * limit;

      const { count, rows } = await Embarque.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
        include: {
          model: Passageiro,
          as: 'passageiro',
          attributes: ['nome']
        }
      });

      // 3. Calcular o total de páginas
      const totalPages = Math.ceil(count / limit);

      // 4. Enviar a resposta estruturada
      res.status(200).json({
        data: rows,
        totalItems: count,
        totalPages: totalPages,
        currentPage: page
      });

    } catch (error) {
      console.error("Erro em PresencaController.listarTodas:", error);
      res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  },
};

module.exports = PresencaController;
