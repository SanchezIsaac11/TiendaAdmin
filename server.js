
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Importar módulos separados
const { initializeDatabase } = require('./config/database');
const handleProductRoutes = require('./routes/productosRoutes');

// Inicializar almacenamiento
initializeDatabase();

// Crear servidor HTTP
const server = http.createServer((req, res) => {

    // Configuración CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Delegar las rutas de productos
    if (handleProductRoutes(req, res)) {
        return;
    }

    // Servir archivos del frontend
    const filePath = path.join(
        __dirname,
        req.url === '/' ? 'index.html' : req.url
    );

    const ext = path.extname(filePath);

    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.json': 'application/json'
    };

    const contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                res.end('404 No Encontrado');
            } else {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('Error Interno del Servidor');
            }
        } else {
            res.writeHead(200, {
                'Content-Type': contentType
            });
            res.end(content);
        }
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log('========================================');
    console.log('Servidor TiendaAdmin iniciado');
    console.log(`http://localhost:${PORT}`);
    console.log('Endpoints disponibles:');
    console.log(`GET  http://localhost:${PORT}/api/productos`);
    console.log(`POST http://localhost:${PORT}/api/productos`);
    console.log('========================================');
});
