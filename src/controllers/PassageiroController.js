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
            res.status(201).json({ mensagem: `${passageiro.nome}!` });
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

            if (!nome || !rfid_tag) {
                return res.status(400).json({ erro: 'Os campos "nome" e "rfid_tag" são obrigatórios.' });
            }

            const novoPassageiro = await Passageiro.create({
                nome,
                rfid_tag,
                autorizado: autorizado
            });

            res.status(201).json(novoPassageiro);

        } catch (error) {
            console.log(error);
            if (error instanceof Sequelize.UniqueConstraintError) {
                return res.status(409).json({ erro: 'A tag RFID fornecida já está em uso.' });
            }

            console.error("Erro em criarPassageiro:", error);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    },

    /**
 * Atualiza os dados de um passageiro específico.
 * Associada à rota: PUT /api/passageiros/:id
 */
    async atualizarPassageiro(req, res) {
        try {
            const { id } = req.params;
            const { nome, rfid_tag, autorizado } = req.body;

            const passageiro = await Passageiro.findByPk(id);

            if (!passageiro) {
                return res.status(404).json({ erro: 'Passageiro não encontrado.' });
            }

            passageiro.nome = nome || passageiro.nome;
            passageiro.rfid_tag = rfid_tag || passageiro.rfid_tag;

            if (autorizado !== undefined) {
                passageiro.autorizado = autorizado;
            }

            await passageiro.save();

            res.status(200).json(passageiro);

        } catch (error) {
            if (error instanceof Sequelize.UniqueConstraintError) {
                return res.status(409).json({ erro: 'A tag RFID fornecida já está em uso por outro passageiro.' });
            }
            console.error("Erro em atualizarPassageiro:", error);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    },

    /**
 * Busca os dados de um passageiro específico pelo seu ID.
 * Associada à rota: GET /api/passageiros/:id
 */
    async getPassageiroById(req, res) {
        try {
            const { id } = req.params;
            const passageiro = await Passageiro.findByPk(id);

            if (!passageiro) {
                return res.status(404).json({ erro: 'Passageiro não encontrado.' });
            }

            res.status(200).json(passageiro);
        } catch (error) {
            console.error("Erro em getPassageiroById:", error);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    },

    /**
     * Deleta um passageiro do sistema.
     * Associada à rota: DELETE /api/passageiros/:id
     */
    async deletarPassageiro(req, res) {
        try {
            const { id } = req.params;

            const passageiro = await Passageiro.findByPk(id);

            if (!passageiro) {
                return res.status(404).json({ erro: 'Passageiro não encontrado.' });
            }

            await passageiro.destroy();

            res.status(204).send();

        } catch (error) {
            console.error("Erro em deletarPassageiro:", error);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    },

    /**
  * Função para listar todos os passageiros cadastrados.
  * Associada à rota: GET /api/passageiros
  */
    async listarPassageiros(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 10; 
            const offset = (page - 1) * limit;


            const { count, rows } = await Passageiro.findAndCountAll({
                limit: limit,
                offset: offset,
                order: [['nome', 'ASC']] // Mantém a ordenação alfabética
            });

            // 3. Calcular o total de páginas
            const totalPages = Math.ceil(count / limit);

            // 4. Enviar a resposta num formato estruturado
            res.status(200).json({
                data: rows,
                totalItems: count,
                totalPages: totalPages,
                currentPage: page
            });

        } catch (error) {
            console.error("Erro em listarPassageiros:", error);
            res.status(500).json({ erro: 'Erro interno no servidor.' });
        }
    },
};

module.exports = PassageiroController;