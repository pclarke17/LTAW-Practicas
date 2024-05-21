function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

function toggleLogin() {
    const loginContainer = document.getElementById('loginModal'); 
    if (loginContainer) {
        loginContainer.style.display = loginContainer.style.display === 'block' ? 'none' : 'block';
    }
}

function closeLogin() {
    const loginContainer = document.getElementById('loginModal');
    if (loginContainer) {
        loginContainer.style.display = 'none';
    }
}

// Cerrar menu desplegable si se hace click fuera d el
window.onclick = function(event) {
    const menu = document.getElementById('dropdown-menu');
    if (!event.target.matches('.menu-icon') && !event.target.closest('.dropdown-menu')) {
        if (menu) {
            menu.style.display = 'none';
        }
    }
    if (!event.target.closest('.modal-content') && !event.target.matches('a[href="#"]')) {
        closeLogin();
    }
}

