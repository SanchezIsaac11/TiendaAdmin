
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'productos.json');

// Crear el archivo de productos si todavía no existe
function initializeDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        const seedData = [
            {
                barcode: '7501820511234',
                name: 'Leche Lala Entera 1L',
                category: 'Lácteos y Cremería',
                price: 29.50,
                cost: 22.50,
                stock: 34
            },
            {
                barcode: '750185538472',
                name: 'Coca-Cola Original 600ml',
                category: 'Bebidas y Refrescos',
                price: 19.00,
                cost: 14.00,
                stock: 42
            },
            {
                barcode: '750103912089',
                name: 'Aceite Nutrioli 850ml',
                category: 'Abarrotes y Granos',
                price: 45.00,
                cost: 36.00,
                stock: 15
            }
        ];

        fs.writeFileSync(
            DB_FILE,
            JSON.stringify(seedData, null, 2),
            'utf-8'
        );
    }
}

// Obtener todos los productos
function getProducts() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Guardar productos
function saveProducts(products) {
    fs.writeFileSync(
        DB_FILE,
        JSON.stringify(products, null, 2),
        'utf-8'
    );
}

module.exports = {
    initializeDatabase,
    getProducts,
    saveProducts
};

