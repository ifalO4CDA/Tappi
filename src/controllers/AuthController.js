const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Use uma chave secreta segura e guarde-a no seu ficheiro .env
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-dificil';

const AuthController = {
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ erro: 'Utilizador e senha são obrigatórios.' });
        }

        try {
            const user = await User.findOne({ where: { username } });

            console.log(`Tentativa de login: ${username}`); // Log para depuração
            if (!user || !user.validPassword(password)) {
                console.log(`Falha no login: ${username}`); // Log para depuração
                return res.status(401).json({ erro: 'Credenciais inválidas.' });
            }

            
            // Gera o token JWT
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
                expiresIn: '8h' // O token expira em 8 horas
            });
            console.log(`Login bem-sucedido: ${username}`); // Log para depuração
            res.status(200).json({ token });

        } catch (error) {
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    }
};

module.exports = AuthController;