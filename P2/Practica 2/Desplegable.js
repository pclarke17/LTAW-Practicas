function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

function toggleLogin() {
    const loginContainer = document.getElementById('loginModal'); // Asegúrate de que este ID exista en el HTML
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

// Close the dropdown menu if the user clicks outside of it
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

