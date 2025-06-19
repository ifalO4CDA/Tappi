document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('presencas-table-body');
    const paginationContainer = document.getElementById('pagination-container');
    let currentPage = 1;

    function formatarData(dataISO) {
        if (!dataISO) return 'Data indisponível';
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        };
        try {
            return new Date(dataISO).toLocaleString('pt-BR', options);
        } catch (error) {
            return 'Data inválida';
        }
    }

    function renderPagination(totalPages, currentPage) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const pageInfo = document.createElement('div');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;

        const controls = document.createElement('div');
        controls.className = 'pagination-controls';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) fetchPresencas(currentPage - 1);
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próxima';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) fetchPresencas(currentPage + 1);
        });

        controls.appendChild(prevButton);
        controls.appendChild(nextButton);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(controls);
    }

    async function fetchPresencas(page = 1) {
        try {
            const response = await fetch(`/api/presencas?page=${page}&limit=10`);
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }
            
            const result = await response.json();
            const presencas = result.data;
            
            tableBody.innerHTML = '';

            if (presencas.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 2rem;">Nenhum registo de presença encontrado.</td></tr>`;
                paginationContainer.innerHTML = ''; // Limpa a paginação se não houver dados
                return;
            }

            tableBody.innerHTML = presencas.map(presenca => {
                const nomePassageiro = presenca.passageiro ? presenca.passageiro.nome : 'Passageiro não identificado';
                return `
                    <tr>
                        <td><strong>${nomePassageiro}</strong></td>
                        <td>${formatarData(presenca.createdAt)}</td>
                    </tr>
                `;
            }).join('');
            
            renderPagination(result.totalPages, result.currentPage);

        } catch (error) {
            console.error('Erro ao buscar presenças:', error);
            tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 2rem;">Falha ao carregar os dados. Verifique o console.</td></tr>`;
        }
    }

    fetchPresencas(1);
});
