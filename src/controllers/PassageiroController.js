const { Passageiro, Embarque } = require('../models');
const { Sequelize } = require('sequelize');
const PassageiroController = {

    /**
     * Função para verificar a autorização de um passageiro.
     * Associada à rota: GET /api//passageiro/:rfid_tag
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
     * Associada à rota: POST /api/passageiro/presenca
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

    /**
     * Função para criar um novo passageiro no sistema.
     * Associada à rota: POST /api/passageiros
     */
    async criarPassageiro(req, res) {
        try {
            const { nome, rfid_tag, autorizado } = req.body;

            // Validação básica dos dados de entrada
            if (!nome || !rfid_tag) {
                return res.status(400).json({ erro: 'Os campos "nome" e "rfid_tag" são obrigatórios.' });
            }

            const novoPassageiro = await Passageiro.create({
                nome,
                rfid_tag,
                autorizado: autorizado
            });

            // Retorna o status 201 (Created) e os dados do passageiro criado
            res.status(201).json(novoPassageiro);

        } catch (error) {
            console.log(error);
            // Tratamento de erro específico para violação de constraint (ex: rfid_tag duplicada)
            if (error instanceof Sequelize.UniqueConstraintError) {
                return res.status(409).json({ erro: 'A tag RFID fornecida já está em uso.' });
            }

            console.error("Erro em criarPassageiro:", error);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    },

    /**
  * Função para listar todos os passageiros cadastrados.
  * Associada à rota: GET /api/passageiros
  */
    async listarPassageiros(req, res) {
        try {
            // O método findAll() busca todos os registros da tabela Passageiro.
            const passageiros = await Passageiro.findAll({
                // Dica: você pode refinar a busca aqui. Exemplos:
                // order: [['nome', 'ASC']], // Ordena por nome em ordem ascendente
                // attributes: ['id', 'nome', 'rfid_tag', 'autorizado'], // Retorna apenas estes campos
            });

            // Retorna status 200 (OK) e a lista de passageiros em formato JSON.
            res.status(200).json(passageiros);

        } catch (error) {
            console.error("Erro em listarTodos:", error);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    },
};

module.exports = PassageiroController;