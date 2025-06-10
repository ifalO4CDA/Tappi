const express = require('express');
const router = express.Router();

const PassageiroController = require('../controllers/PassageiroController');

// Rota para verificar um passageiro
router.get('/passageiro/:rfid_tag', PassageiroController.verificarAutorizacao);

// Rota para registrar a presença
router.post('/passageiro/registrar', PassageiroController.registrarPresenca);

module.exports = router;