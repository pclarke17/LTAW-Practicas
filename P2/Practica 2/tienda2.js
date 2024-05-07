const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 9090;

const server = http.createServer((req, res) => {
    var filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html'; // Página principal
    }

    if (filePath === './login.html' && req.method === 'POST') {
        // Manejar inicio de sesión
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const username = body.split('=')[1]; // Obtener el nombre de usuario del formulario
            // Verificar el nombre de usuario (aquí deberías implementar la lógica de autenticación)
            if (username) {
                // Si el nombre de usuario es válido, redireccionar a la página principal
                res.writeHead(302, { 'Location': '/index.html' });
                res.end();
            } else {
                // Si el nombre de usuario no es válido, redireccionar de nuevo a la página de inicio de sesión
                res.writeHead(302, { 'Location': '/login.html' });
                res.end();
            }
        });
    } else {
        // Servir otros archivos estáticos
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif'
        }[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.readFile('./404.html', (err, content) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                    });
                } else {
                    res.writeHead(500);
                    res.end(`Error interno del servidor: ${err.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Servidor web iniciado en el puerto ${PORT}`);
});
