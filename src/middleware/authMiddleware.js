
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-dificil';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido.' });
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ erro: 'Token mal formatado.' });
    }

    const token = parts[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: 'Token inválido ou expirado.' });
        }

        req.userId = decoded.id; 
        return next();
    });
};
