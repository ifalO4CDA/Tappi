document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos do DOM ---
    const tableBody = document.getElementById('passenger-table-body');
    const paginationContainer = document.getElementById('pagination-container');

    // Elementos do Modal de Edição
    const editModalOverlay = document.getElementById('edit-modal-overlay');
    const editForm = document.getElementById('edit-passenger-form');
    const closeEditModalBtn = document.getElementById('close-modal-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editPassengerIdInput = document.getElementById('edit-passenger-id');
    const editPassengerNameInput = document.getElementById('edit-nome');
    const editPassengerRfidInput = document.getElementById('edit-rfid');
    const editPassengerAutorizadoInput = document.getElementById('edit-autorizado');
    const editPassengerStatusLabel = document.getElementById('edit-status-label');

    // Elementos do Modal de Adicionar
    const addModalOverlay = document.getElementById('add-modal-overlay');
    const addPassengerBtn = document.getElementById('add-passenger-btn');
    const addForm = document.getElementById('add-passenger-form');
    const closeAddModalBtn = document.getElementById('close-add-modal-btn');
    const cancelAddBtn = document.getElementById('cancel-add-btn');
    const addAutorizadoInput = document.getElementById('add-autorizado');
    const addStatusLabel = document.getElementById('add-status-label');

    // --- Variáveis de Estado ---
    let currentPage = 1;

    // --- Funções Auxiliares ---
    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('visible');
        });
    }

    // --- Lógica de Renderização ---

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
            if (currentPage > 1) fetchPassengers(currentPage - 1);
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Próxima';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) fetchPassengers(currentPage + 1);
        });

        controls.appendChild(prevButton);
        controls.appendChild(nextButton);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(controls);
    }

    function addActionListeners() {
        addPassengerBtn.addEventListener('click', () => {
            addForm.reset();
            addAutorizadoInput.checked = true;
            addStatusLabel.textContent = 'Autorizado';
            addModalOverlay.classList.add('visible');
        });

        document.querySelectorAll('.icon-btn.delete').forEach(button => {
            button.addEventListener('click', async (e) => {
                const passengerId = e.currentTarget.dataset.id;
                const passengerRow = e.currentTarget.closest('tr');
                const passengerName = passengerRow.querySelector('td:first-child strong').textContent;

                if (confirm(`Tem a certeza que deseja eliminar o passageiro "${passengerName}"?`)) {
                    try {
                        const response = await fetch(`/api/passageiros/${passengerId}`, { method: 'DELETE' });
                        if (response.ok) {
                            fetchPassengers(currentPage); // Recarrega a página atual
                        } else {
                            alert('Falha ao eliminar o passageiro.');
                        }
                    } catch (error) {
                        alert('Ocorreu um erro de comunicação com o servidor.');
                    }
                }
            });
        });

        document.querySelectorAll('.icon-btn.edit').forEach(button => {
            button.addEventListener('click', async (e) => {
                const passengerId = e.currentTarget.dataset.id;
                try {
                    const response = await fetch(`/api/passageiros/${passengerId}`);
                    if (!response.ok) throw new Error('Falha ao buscar dados do passageiro.');

                    const passenger = await response.json();

                    editPassengerIdInput.value = passenger.id;
                    editPassengerNameInput.value = passenger.nome;
                    editPassengerRfidInput.value = passenger.rfid_tag;
                    editPassengerAutorizadoInput.checked = passenger.autorizado;
                    editPassengerStatusLabel.textContent = passenger.autorizado ? 'Autorizado' : 'Não Autorizado';

                    editModalOverlay.classList.add('visible');
                } catch (error) {
                    alert(error.message);
                }
            });
        });
    }

    async function fetchPassengers(page = 1) {

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/passageiros?page=${page}&limit=7`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            const passengers = result.data;
            currentPage = result.currentPage;

            tableBody.innerHTML = '';

            if (passengers.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem;">Nenhum passageiro encontrado.</td></tr>`;
            } else {
                tableBody.innerHTML = passengers.map(passenger => {
                    const statusClass = passenger.autorizado ? 'autorizado' : 'nao-autorizado';
                    const statusText = passenger.autorizado ? 'Autorizado' : 'Não Autorizado';
                    return `
                        <tr>
                            <td><strong>${passenger.nome}</strong></td>
                            <td>${passenger.rfid_tag}</td>
                            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="icon-btn edit" title="Editar Passageiro" data-id="${passenger.id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" /></svg></button>
                                    <button class="icon-btn delete" title="Eliminar Passageiro" data-id="${passenger.id}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg></button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            }

            renderPagination(result.totalPages, result.currentPage);
            addActionListeners();
        } catch (error) {
            console.error('Erro ao buscar passageiros:', error);
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 2rem;">Falha ao carregar os dados.</td></tr>`;
        }
    }

    // --- Listeners dos Modais ---
    closeAddModalBtn.addEventListener('click', closeAllModals);
    cancelAddBtn.addEventListener('click', closeAllModals);
    addModalOverlay.addEventListener('click', (e) => { if (e.target === addModalOverlay) closeAllModals(); });
    addAutorizadoInput.addEventListener('change', () => { addStatusLabel.textContent = addAutorizadoInput.checked ? 'Autorizado' : 'Não Autorizado'; });
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/passageiros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: document.getElementById('add-nome').value,
                    rfid_tag: document.getElementById('add-rfid').value,
                    autorizado: document.getElementById('add-autorizado').checked
                })
            });
            if (response.ok) {
                fetchPassengers(currentPage);
                closeAllModals();
            } else {
                alert(`Falha ao cadastrar: ${(await response.json()).erro}`);
            }
        } catch (error) {
            alert('Ocorreu um erro de comunicação com o servidor.');
        }
    });

    closeEditModalBtn.addEventListener('click', closeAllModals);
    cancelEditBtn.addEventListener('click', closeAllModals);
    editModalOverlay.addEventListener('click', (e) => { if (e.target === editModalOverlay) closeAllModals(); });
    editPassengerAutorizadoInput.addEventListener('change', () => { editPassengerStatusLabel.textContent = editPassengerAutorizadoInput.checked ? 'Autorizado' : 'Não Autorizado'; });
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = editPassengerIdInput.value;
        try {
            const response = await fetch(`/api/passageiros/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: editPassengerNameInput.value,
                    rfid_tag: editPassengerRfidInput.value,
                    autorizado: editPassengerAutorizadoInput.checked
                })
            });
            if (response.ok) {
                fetchPassengers(currentPage);
                closeAllModals();
            } else {
                alert(`Falha ao atualizar: ${(await response.json()).erro}`);
            }
        } catch (error) {
            alert('Ocorreu um erro de comunicação com o servidor.');
        }
    });

    // --- Carga Inicial ---
    fetchPassengers(1);
});
