
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

let serverProcess;
let baseUrl;
let tempDirectory;
let databaseFile;

// Inicia el servidor con un archivo de datos temporal
before(async () => {
  tempDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'tiendaadmin-test-')
  );

  databaseFile = path.join(tempDirectory, 'productos.json');

  fs.writeFileSync(databaseFile, JSON.stringify([
    {
      barcode: 'TEST001',
      name: 'Producto inicial',
      category: 'Abarrotes',
      price: 20,
      cost: 10,
      stock: 5
    }
  ]));

  // Copiar el servidor a la carpeta temporal
  const originalServer = path.resolve(__dirname, '../../server.js');
  const temporaryServer = path.join(tempDirectory, 'server.js');

  fs.copyFileSync(originalServer, temporaryServer);

  // Copiar los archivos del frontend a la carpeta temporal
fs.copyFileSync(
  path.resolve(__dirname, '../../index.html'),
  path.join(tempDirectory, 'index.html')
);

fs.copyFileSync(
  path.resolve(__dirname, '../../app.js'),
  path.join(tempDirectory, 'app.js')
);

fs.copyFileSync(
  path.resolve(__dirname, '../../styles.css'),
  path.join(tempDirectory, 'styles.css')
);

  baseUrl = 'http://localhost:3000';

  serverProcess = spawn(process.execPath, [temporaryServer], {
    cwd: tempDirectory,
    stdio: 'ignore'
  });

  // Esperar a que el servidor esté disponible
  for (let attempt = 0; attempt < 30; attempt++) {
    if (serverProcess.exitCode !== null) {
      throw new Error('El servidor terminó inesperadamente');
    }

    try {
      const response = await fetch(`${baseUrl}/api/productos`);
      if (response.ok) return;
    } catch {}

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  throw new Error('El servidor no pudo iniciar en el puerto 3000');
});

// Detiene el servidor y elimina los datos temporales
after(async () => {
  if (serverProcess) {
    serverProcess.kill();

    await new Promise(resolve => {
      serverProcess.once('exit', resolve);
    });
  }

  if (tempDirectory) {
    fs.rmSync(tempDirectory, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 500
    });
  }
});

test('GET /api/productos devuelve los productos', async () => {
  const response = await fetch(`${baseUrl}/api/productos`);

  assert.strictEqual(response.status, 200);

  const products = await response.json();

  assert.ok(Array.isArray(products));
  assert.strictEqual(products[0].name, 'Producto inicial');
});

test('POST /api/productos registra un producto', async () => {
  const newProduct = {
    barcode: 'TEST002',
    name: 'Producto de prueba',
    category: 'Bebidas',
    price: 30,
    cost: 15,
    stock: 10
  };

  const response = await fetch(`${baseUrl}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  });

  assert.strictEqual(response.status, 201);

  const result = await response.json();

  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.producto.barcode, 'TEST002');
});

test('El producto registrado queda guardado en el archivo JSON', async () => {
  const products = JSON.parse(fs.readFileSync(databaseFile, 'utf8'));

  const savedProduct = products.find(
    product => product.barcode === 'TEST002'
  );

  assert.ok(savedProduct);
  assert.strictEqual(savedProduct.name, 'Producto de prueba');
});

test('Registrar el mismo código de barras actualiza el producto', async () => {
  const updatedProduct = {
    barcode: 'TEST002',
    name: 'Producto actualizado',
    category: 'Bebidas',
    price: 35,
    cost: 15,
    stock: 20
  };

  const response = await fetch(`${baseUrl}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProduct)
  });

  assert.strictEqual(response.status, 201);

  const products = JSON.parse(fs.readFileSync(databaseFile, 'utf8'));

  const matchingProducts = products.filter(
    product => product.barcode === 'TEST002'
  );

  assert.strictEqual(matchingProducts.length, 1);
  assert.strictEqual(matchingProducts[0].name, 'Producto actualizado');
});

test('POST rechaza un JSON inválido', async () => {
  const response = await fetch(`${baseUrl}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ producto incorrecto'
  });

  assert.strictEqual(response.status, 400);
});

test('Una ruta inexistente devuelve 404', async () => {
  const response = await fetch(`${baseUrl}/api/ruta-inexistente`);

  assert.strictEqual(response.status, 404);
});


test('El servidor entrega correctamente el frontend', async () => {
  // Comprobar que se entrega la página principal
  const htmlResponse = await fetch(`${baseUrl}/`);

  assert.strictEqual(htmlResponse.status, 200);

  const html = await htmlResponse.text();

  assert.ok(html.includes('productForm'));
  assert.ok(html.includes('app.js'));

  // Comprobar que se entrega el JavaScript del frontend
  const jsResponse = await fetch(`${baseUrl}/app.js`);

  assert.strictEqual(jsResponse.status, 200);

  const javascript = await jsResponse.text();

  assert.ok(javascript.includes('loadProducts'));
  assert.ok(javascript.includes('/api/productos'));
});