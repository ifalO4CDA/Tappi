document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('presencas-table-body');

    // Função para formatar a data para o padrão brasileiro
    function formatarData(dataISO) {
        if (!dataISO) return 'Data indisponível';
        
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false // Formato de 24 horas
        };
        
        try {
            return new Date(dataISO).toLocaleString('pt-BR', options);
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    }

    // Função para buscar e exibir os registros de presença
    async function fetchPresencas() {
        try {
            // 1. Faz a requisição para a rota da API que busca as presenças
            const response = await fetch('/api/presencas');
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }
            
            const presencas = await response.json();
            
            // 2. Limpa o corpo da tabela
            tableBody.innerHTML = '';

            // 3. Verifica se há registros para exibir
            if (presencas.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 2rem;">Nenhum registro de presença encontrado.</td></tr>`;
                return;
            }

            // 4. Cria e insere uma linha na tabela para cada registro de presença
            presencas.forEach(presenca => {
                // Garante que o nome do passageiro seja exibido corretamente
                const nomePassageiro = presenca.passageiro ? presenca.passageiro.nome : 'Passageiro não identificado';
                
                const row = `
                    <tr>
                        <td><strong>${nomePassageiro}</strong></td>
                        <td>${formatarData(presenca.createdAt)}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });

        } catch (error) {
            console.error('Erro ao buscar presenças:', error);
            tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 2rem;">Falha ao carregar os dados. Verifique o console.</td></tr>`;
        }
    }

    fetchPresencas();
});
