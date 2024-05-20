const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const server = require('./server'); // Importa el servidor de chat

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('version-info', {
            node: process.versions.node,
            chrome: process.versions.chrome,
            electron: process.versions.electron,
            url: `http://localhost:${server.PORT}`
        });
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
