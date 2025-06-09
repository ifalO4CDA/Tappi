// index.js
require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');
const PORT = process.env.PORT || 3069;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
});