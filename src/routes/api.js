const express = require('express');
const router = express.Router();
const PresencaController = require('../controllers/PresencaController'); 
const PassageiroController = require('../controllers/PassageiroController');

// Rota para LISTAR todos os passageiros
router.get('/passageiros', PassageiroController.listarPassageiros);

// Rota para verificar um passageiro
router.get('/passageiro/:rfid_tag', PassageiroController.verificarAutorizacao);

// Rota para registrar a presença
router.post('/passageiro/presenca', PassageiroController.registrarPresenca);

// Rota para CRIAR um novo passageiro
router.post('/passageiros', PassageiroController.criarPassageiro);

// Rota para ATUALIZAR um passageiro específico
router.put('/passageiros/:id', PassageiroController.atualizarPassageiro);

// Rota para BUSCAR um passageiro específico pelo seu ID
router.get('/passageiros/:id', PassageiroController.getPassageiroById);


// Rota para DELETAR um passageiro específico
router.delete('/passageiros/:id', PassageiroController.deletarPassageiro);

// --- Rota de Presenças ---
router.get('/presencas', PresencaController.listarTodas);

// quero fazer uma rota ping para verificar se o servidor está ativo
router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'OK!' });
});
module.exports = router;