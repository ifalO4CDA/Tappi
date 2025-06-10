const { Passageiro, Embarque } = require('../models');

const PassageiroController = {

  /**
   * Função para verificar a autorização de um passageiro.
   * Associada à rota: GET /api/verificar/:rfid_tag
   */
  async verificarAutorizacao(req, res) {
    try {
      const { rfid_tag } = req.params;
      const passageiro = await Passageiro.findOne({ where: { rfid_tag } });

      if (!passageiro) {
        return res.status(404).json({ autorizado: false, nome: "N/A", mensagem: 'Passageiro não encontrado.' });
      }

      res.json({
        autorizado: passageiro.autorizado,
        nome: passageiro.nome,
        mensagem: passageiro.autorizado ? 'Embarque autorizado!' : 'Embarque NÃO autorizado!'
      });
    } catch (error) {
      console.error("Erro em verificarAutorizacao:", error);
      res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  },

  /**
   * Função para registrar a presença (embarque) de um passageiro.
   * Associada à rota: POST /api/registrar-presenca
   */
  async registrarPresenca(req, res) {
    try {
      const { rfid_tag } = req.body;
      if (!rfid_tag) {
        return res.status(400).json({ erro: 'O campo rfid_tag é obrigatório.' });
      }

      const passageiro = await Passageiro.findOne({ where: { rfid_tag } });

      if (!passageiro) {
        return res.status(404).json({ erro: 'Passageiro não encontrado.' });
      }
      if (!passageiro.autorizado) {
        return res.status(403).json({ erro: 'Passageiro não possui autorização para embarcar.' });
      }

      await Embarque.create({ passageiro_id: passageiro.id });
      res.status(201).json({ mensagem: `Presença de ${passageiro.nome} registrada com sucesso!` });
    } catch (error) {
      console.error("Erro em registrarPresenca:", error);
      res.status(500).json({ erro: 'Erro interno no servidor.' });
    }
  },


};

module.exports = PassageiroController;