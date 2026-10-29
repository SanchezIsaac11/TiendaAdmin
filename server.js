
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'productos.json');

// Inicializar archivo de persistencia si no existe
if (!fs.existsSync(DB_FILE)) {
  const datosIniciales = [
    { barcode: '7501820511234', name: 'Leche Lala Entera 1L', category: 'Lácteos y Cremería', price: 29.50, cost: 22.50, stock: 34 },
    { barcode: '750185538472', name: 'Coca-Cola Original 600ml', category: 'Bebidas y Refrescos', price: 19.00, cost: 14.00, stock: 42 },
    { barcode: '750103912089', name: 'Aceite Nutrioli 850ml', category: 'Abarrotes y Granos', price: 45.00, cost: 36.00, stock: 15 }
  ];
  fs.writeFileSync(DB_FILE, JSON.stringify(datosIniciales, null, 2), 'utf-8');
}

function leerProductos() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function guardarProductos(productos) {
  fs.writeFileSync(DB_FILE, JSON.stringify(productos, null, 2), 'utf-8');
}

// Crear servidor HTTP
const server = http.createServer((req, res) => {
  // Configuración de cabeceras CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. ENDPOINT GET /api/productos: Obtener productos
  if (req.method === 'GET' && req.url === '/api/productos') {
    const productos = leerProductos();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(productos));
    return;
  }

  // 2. ENDPOINT POST /api/productos: Guardar producto nuevo
  if (req.method === 'POST' && req.url === '/api/productos') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const nuevo = JSON.parse(body);

        const productos = leerProductos();
        const existeIndex = productos.findIndex(p => p.barcode === nuevo.barcode);
        if (existeIndex >= 0) {
          productos[existeIndex] = nuevo;
        } else {
          productos.unshift(nuevo);
        }

        guardarProductos(productos);

        console.log(`[BACKEND] Producto guardado: ${nuevo.name} ($${nuevo.price})`);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, producto: nuevo }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'JSON inválido' }));
      }
    });
    return;
  }

  // 3. SERVIR ARCHIVOS ESTÁTICOS (HTML, CSS, JS)
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
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
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 No Encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error Interno del Servidor');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log('========================================================');
  console.log(`Servidor Backend de Persistencia iniciado en:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log('Endpoints disponibles:');
  console.log(`- GET  http://localhost:${PORT}/api/productos`);
  console.log(`- POST http://localhost:${PORT}/api/productos`);
  console.log('========================================================');
});

