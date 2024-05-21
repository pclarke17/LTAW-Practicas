
const socket = io();

const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');


function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        <div class="sender">${message.sender}</div>
        <div class="content">${message.content}</div>
    `;
    messagesContainer.appendChild(messageElement);
}


chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message.trim() !== '') {
        socket.emit('message', { sender: 'Cliente', content: message });
        messageInput.value = '';
    }
});


socket.on('message', (message) => {
    showMessage(message);
});
