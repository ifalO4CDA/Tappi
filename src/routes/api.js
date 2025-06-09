// src/routes/api.js
const express = require('express');
const router = express.Router();
const { Passageiro, Embarque } = require('../models');

router.get('/verificar/:rfid_tag', async (req, res) => {
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
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

router.post('/registrar-presenca', async (req, res) => {
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
    res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
});

module.exports = router;