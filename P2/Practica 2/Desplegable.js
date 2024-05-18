function toggleMenu() {
    const menu = document.getElementById('dropdown-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function toggleLogin() {
    const loginContainer = document.getElementById('loginContainer');
    loginContainer.style.display = loginContainer.style.display === 'flex' ? 'none' : 'flex';
}

function closeLogin() {
    document.getElementById('loginContainer').style.display = 'none';
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.menu-icon') && !event.target.closest('.dropdown-menu')) {
        const dropdowns = document.getElementsByClassName('dropdown-menu');
        for (let i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = 'none';
        }
    }
    if (!event.target.closest('.login-popup') && !event.target.matches('a[href="#"]')) {
        closeLogin();
    }
}
