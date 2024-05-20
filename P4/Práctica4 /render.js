window.electron.onVersionInfo((data) => {
    document.getElementById('node-version').textContent = data.node;
    document.getElementById('chrome-version').textContent = data.chrome;
    document.getElementById('electron-version').textContent = data.electron;
    document.getElementById('chat-url').textContent = data.url;
});
