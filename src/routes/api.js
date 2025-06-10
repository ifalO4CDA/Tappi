const express = require('express');
const router = express.Router();

const PassageiroController = require('../controllers/PassageiroController');

// Rota para LISTAR todos os passageiros
router.get('/passageiros', PassageiroController.listarPassageiros);

// Rota para verificar um passageiro
router.get('/passageiro/:rfid_tag', PassageiroController.verificarAutorizacao);

// Rota para registrar a presença
router.post('/passageiro/presenca', PassageiroController.registrarPresenca);

// Rota para CRIAR um novo passageir
router.post('/passageiros', PassageiroController.criarPassageiro);

// Rota para ATUALIZAR um passageiro específico
router.put('/passageiros/:id', PassageiroController.atualizarPassageiro);

// Rota para DELETAR um passageiro específico
router.delete('/passageiros/:id', PassageiroController.deletarPassageiro);


module.exports = router;