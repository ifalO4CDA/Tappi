const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const PassageiroController = require('../controllers/PassageiroController');
const PresencaController = require('../controllers/PresencaController');
const authMiddleware = require('../middleware/authMiddleware');

// --- Rotas Públicas (NÃO precisam de autenticação) ---
router.post('/login', AuthController.login);
// Rota aberta para o dispositivo IoT
router.post('/passageiro/presenca', PassageiroController.registrarPresenca);
router.get('/ping', (req, res) => {
    res.status(200).json({ message: 'OK!' });
});


// --- Middleware de Autenticação ---
// Todas as rotas definidas ABAIXO desta linha estarão protegidas
router.use(authMiddleware);


// --- Rotas Protegidas (PRECISAM de autenticação) ---

// Rotas CRUD para Passageiros
router.post('/passageiros', PassageiroController.criarPassageiro);
router.get('/passageiros', PassageiroController.listarPassageiros);
router.get('/passageiros/:id', PassageiroController.getPassageiroById);
router.put('/passageiros/:id', PassageiroController.atualizarPassageiro);
router.delete('/passageiros/:id', PassageiroController.deletarPassageiro);

// Rota de Presenças
router.get('/presencas', PresencaController.listarTodas);

// Rota de verificação (pode ser útil para o dashboard)
router.get('/verificar/:rfid_tag', PassageiroController.verificarAutorizacao);


module.exports = router;
