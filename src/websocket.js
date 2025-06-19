const { WebSocketServer, WebSocket } = require('ws');

let wss;

function initWebSocket(server) {
    wss = new WebSocketServer({ server });

    wss.on('connection', ws => {
        console.log('✅ Cliente WebSocket conectado.');
        ws.on('close', () => console.log('Cliente WebSocket desconectado.'));
    });
    console.log('🚀 Servidor WebSocket inicializado e pronto para receber conexões.');
}

function broadcast(data) {
    if (!wss) return;

    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

module.exports = { initWebSocket, broadcast };
