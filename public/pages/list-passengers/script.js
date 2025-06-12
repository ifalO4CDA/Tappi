// Espera o conteúdo da página ser totalmente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    
    const tableBody = document.getElementById('passenger-table-body');

    // Função para buscar os passageiros na API
    async function fetchPassengers() {
        try {
            // Faz a requisição para o nosso endpoint da API
            const response = await fetch('/api/passageiros');
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados da API');
            }
            const passengers = await response.json();
            
            // Limpa a tabela antes de preencher com os novos dados
            tableBody.innerHTML = '';

            // Se não houver passageiros, exibe uma mensagem
            if (passengers.length === 0) {
                const row = `<tr><td colspan="4">Nenhum passageiro encontrado.</td></tr>`;
                tableBody.innerHTML = row;
                return;
            }

            // Para cada passageiro, cria uma linha na tabela
            passengers.forEach(passenger => {
                const statusClass = passenger.autorizado ? 'autorizado' : 'nao-autorizado';
                const statusText = passenger.autorizado ? 'Autorizado' : 'Não Autorizado';
                
                const row = `
                    <tr>
                        <td>${passenger.id}</td>
                        <td>${passenger.nome}</td>
                        <td>${passenger.rfid_tag}</td>
                        <td><span class="status ${statusClass}">${statusText}</span></td>
                    </tr>
                `;
                // Adiciona a linha criada ao corpo da tabela
                tableBody.innerHTML += row;
            });

        } catch (error) {
            console.error('Erro:', error);
            tableBody.innerHTML = `<tr><td colspan="4">Falha ao carregar os dados. Verifique o console.</td></tr>`;
        }
    }

    // Chama a função para carregar os passageiros assim que a página abre
    fetchPassengers();
});