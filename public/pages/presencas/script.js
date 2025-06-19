document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('presencas-table-body');
    const paginationContainer = document.getElementById('pagination-container');
    const notificationContainer = document.getElementById('notification-container');
    
    let currentPage = 1;
    const token = localStorage.getItem('authToken'); // Pega o token

    // --- Lógica de Notificação em Tempo Real ---
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        const icon = `<svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; color: var(--accent-color);" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`;
        notification.innerHTML = `${icon} <p>${message}</p>`;
        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    function connectWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => console.log('Conectado ao servidor WebSocket.');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'NOVA_PRESENCA') {
                showNotification(`Presença registada: <strong>${data.payload.nome}</strong>`);
                if (currentPage === 1) fetchPresencas(1);
            }
        };
        ws.onclose = () => setTimeout(connectWebSocket, 5000);
        ws.onerror = (error) => console.error('Erro de WebSocket:', error);
    }

    // --- Lógica da Página de Presenças ---

    function formatarData(dataISO) {
        if (!dataISO) return 'Data indisponível';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dataISO).toLocaleString('pt-BR', options);
    }

    function renderPagination(totalPages, page) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;

        const pageInfo = document.createElement('div');
        pageInfo.className = 'page-info';
        pageInfo.textContent = `Página ${page} de ${totalPages}`;
        
        const controls = document.createElement('div');
        controls.className = 'pagination-controls';

        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', () => fetchPresencas(page - 1));

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próxima';
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', () => fetchPresencas(page + 1));
        
        controls.appendChild(prevButton);
        controls.appendChild(nextButton);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(controls);
    }

    async function fetchPresencas(page = 1) {
        // Guarda de Autenticação
        if (!token) {
            window.location.href = '/login.html';
            return;
        }
        currentPage = page;

        try {
            // Adiciona o cabeçalho de autorização à chamada fetch
            const response = await fetch(`/api/presencas?page=${page}&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Se o token for inválido, redireciona para o login
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                window.location.href = '/login.html';
                return;
            }
            if (!response.ok) throw new Error(`Erro na API: ${response.statusText}`);
            
            const result = await response.json();
            const presencas = result.data;
            
            tableBody.innerHTML = '';

            if (presencas.length === 0 && page === 1) {
                tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 2rem;">Nenhum registo de presença encontrado.</td></tr>`;
                paginationContainer.innerHTML = '';
                return;
            }

            tableBody.innerHTML = presencas.map(presenca => {
                const nomePassageiro = presenca.passageiro ? presenca.passageiro.nome : 'Passageiro não identificado';
                return `<tr><td><strong>${nomePassageiro}</strong></td><td>${formatarData(presenca.createdAt)}</td></tr>`;
            }).join('');
            
            renderPagination(result.totalPages, result.currentPage);

        } catch (error) {
            console.error('Erro ao buscar presenças:', error);
            tableBody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding: 2rem;">Falha ao carregar os dados. Verifique a consola.</td></tr>`;
        }
    }
    
    // --- Inicialização ---
    fetchPresencas(1);
    if(notificationContainer) {
       connectWebSocket(); 
    }
});
