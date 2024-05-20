const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,)));

io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');
    socket.emit('message', { sender: 'Servidor', content: 'Bienvenido al chat!' });

    socket.broadcast.emit('message', { sender: 'Servidor', content: '¡Un nuevo usuario se ha conectado!' });

    socket.on('message', (message) => {
        console.log('Mensaje recibido: ', message);
        io.emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor de chat iniciado en el puerto ${PORT}`);
});

module.exports = { PORT };
