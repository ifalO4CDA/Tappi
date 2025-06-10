const express = require('express');
const router = express.Router();

const PassageiroController = require('../controllers/PassageiroController');

// Rota para verificar um passageiro
router.get('/passageiro/:rfid_tag', PassageiroController.verificarAutorizacao);

// Rota para registrar a presença
router.post('/passageiro/presenca', PassageiroController.registrarPresenca);

// Rota para CRIAR um novo passageir
router.post('/passageiros', PassageiroController.criarPassageiro);

module.exports = router;