require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');
const http = require('http');
const { initWebSocket } = require('./src/websocket'); 

const PORT = process.env.PORT || 3069;

const server = http.createServer(app);

initWebSocket(server);

server.listen(PORT, async () => {
  console.log(`🚀 Servidor HTTP e WebSocket a rodar na porta ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
});