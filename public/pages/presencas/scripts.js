document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('presencas-table-body');

    // Esta função será implementada quando a rota da API estiver pronta
    async function fetchPresencas() {
        tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 2rem;">Funcionalidade em desenvolvimento.</td></tr>`;
        // Exemplo de como seria a lógica futura:
        // const response = await fetch('/api/presencas');
        // const data = await response.json();
        // ...código para renderizar os dados na tabela...
    }

    fetchPresencas();
});
