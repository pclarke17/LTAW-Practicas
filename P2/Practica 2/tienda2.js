const http = require('http');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = 9090;

function leerDatos() {
    try {
        const data = fs.readFileSync('tienda.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error leyendo los datos:', error);
        return { usuarios: [], productos: [], sesiones: {}, carritos: {} };
    }
}

function escribirDatos(data) {
    try {
        fs.writeFileSync('tienda.json', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error escribiendo los datos:', error);
    }
}

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    if (filePath === './login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const username = params.get('username');

            const data = leerDatos();
            if (!data) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error interno del servidor' }));
                return;
            }

            const usuario = data.usuarios.find(u => u.nombre === username);

            if (usuario) {
                const sessionId = uuidv4();
                data.sesiones[sessionId] = username;
                if (!data.carritos[username]) {
                    data.carritos[username] = [];
                }
                escribirDatos(data);
                res.setHeader('Set-Cookie', `sessionId=${sessionId}; HttpOnly`);
                res.writeHead(302, { 'Location': '/' });
                res.end();
            } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Usuario no encontrado' }));
            }
        });
    } else if (filePath === './agregar-al-carrito' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            const params = new URLSearchParams(body);
            const productId = params.get('productId');
            const cantidad = parseInt(params.get('cantidad'), 10);

            const data = leerDatos();
            if (!data) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error interno del servidor' }));
                return;
            }

            try {
                const cookies = req.headers.cookie?.split(';').map(cookie => cookie.trim().split('='));
                const sessionIdPair = cookies?.find(pair => pair[0] === 'sessionId');
                if (!sessionIdPair) {
                    throw new Error('Sesión no válida');
                }
                const sessionId = sessionIdPair[1];
                const username = data.sesiones[sessionId];
                if (!username) {
                    throw new Error('Sesión no válida');
                }

                const producto = data.productos.find(p => p.id === productId);
                if (!producto) {
                    throw new Error('Producto no encontrado');
                }

                if (!data.carritos[username]) {
                    data.carritos[username] = [];
                }
                const carrito = data.carritos[username];
                const itemCarrito = carrito.find(item => item.id === productId);
                if (itemCarrito) {
                    itemCarrito.cantidad += cantidad;
                } else {
                    carrito.push({ id: productId, nombre: producto.nombre, imagen: producto.imagen, precio: producto.precio, cantidad });
                }
                data.carritos[username] = carrito;
                escribirDatos(data);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Producto añadido al carrito' }));
            } catch (error) {
                console.error('Error al agregar al carrito:', error.message);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Error interno del servidor', error: error.message }));
            }
        });
    }else if (filePath === '/ver-carrito' && req.method === 'GET') {
        const params = new URLSearchParams(req.url.split('?')[1]);
        const sessionId = params.get('sessionId');
    
        const data = leerDatos();
        if (!data) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error interno del servidor' }));
            return;
        }
    
        const username = data.sesiones[sessionId];
        if (!username) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Sesión no válida' }));
            return;
        }
    
        const carrito = data.carritos[username] || [];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(carrito));
    } else {
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif'
        }[extname] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.readFile('./404.html', (err, content) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Error interno del servidor');
                        } else {
                            res.writeHead(404, { 'Content-Type': 'text/html' });
                            res.end(content, 'utf-8');
                        }
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
