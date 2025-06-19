// public/auth-guard.js
const token = localStorage.getItem('authToken');
if (!token) {
    // Se não houver token, redireciona para a página de login
    window.location.href = '/login.html';
}
