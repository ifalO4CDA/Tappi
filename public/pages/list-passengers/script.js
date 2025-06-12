document.addEventListener('DOMContentLoaded', () => {
    
    const tableBody = document.getElementById('passenger-table-body');

    // Função para adicionar os event listeners para os botões de ação
    function addActionListeners() {
        // Event listener para os botões de deletar
        document.querySelectorAll('.icon-btn.delete').forEach(button => {
            button.addEventListener('click', async (e) => {
                const passengerId = e.currentTarget.dataset.id;
                const passengerRow = e.currentTarget.closest('tr');
                const passengerName = passengerRow.querySelector('td:first-child strong').textContent;

                if (confirm(`Tem certeza que deseja deletar o passageiro "${passengerName}"?`)) {
                    try {
                        const response = await fetch(`/api/passageiros/${passengerId}`, {
                            method: 'DELETE',
                        });

                        if (response.ok) { // Status 204 No Content é 'ok'
                            // Remove a linha da tabela para um feedback visual imediato
                            passengerRow.remove();
                        } else {
                            const errorData = await response.json();
                            alert(`Falha ao deletar o passageiro: ${errorData.erro || 'Erro desconhecido'}`);
                        }
                    } catch (error) {
                        console.error('Erro ao fazer a requisição de delete:', error);
                        alert('Ocorreu um erro de comunicação com o servidor.');
                    }
                }
            });
        });

        // Event listener para os botões de editar (funcionalidade futura)
        document.querySelectorAll('.icon-btn.edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const passengerId = e.currentTarget.dataset.id;
                alert(`Funcionalidade de editar o passageiro ID ${passengerId} ainda não foi implementada.`);
            });
        });
    }

    // Função principal para buscar e renderizar os passageiros
    async function fetchPassengers() {
        try {
            const response = await fetch('/api/passageiros');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const passengers = await response.json();
            
            tableBody.innerHTML = ''; // Limpa a tabela

            if (passengers.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem;">Nenhum passageiro encontrado.</td></tr>`;
                return;
            }

            passengers.forEach(passenger => {
                const statusClass = passenger.autorizado ? 'autorizado' : 'nao-autorizado';
                const statusText = passenger.autorizado ? 'Autorizado' : 'Não Autorizado';
                
                const row = `
                    <tr>
                        <td><strong>${passenger.nome}</strong></td>
                        <td>${passenger.rfid_tag}</td>
                        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="icon-btn edit" title="Editar Passageiro" data-id="${passenger.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg>
                                </button>
                                <button class="icon-btn delete" title="Deletar Passageiro" data-id="${passenger.id}">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            
            // Adiciona os event listeners depois que todas as linhas foram inseridas no DOM
            addActionListeners();

        } catch (error) {
            console.error('Erro ao buscar passageiros:', error);
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem;">Falha ao carregar os dados.</td></tr>`;
        }
    }

    // Chama a função para carregar os passageiros
    fetchPassengers();
});
