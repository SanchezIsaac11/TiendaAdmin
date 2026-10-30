
const { getProducts, saveProducts } = require('../config/database');

// Obtener todos los productos
function getAllProducts(req, res) {
    const products = getProducts();

    res.writeHead(200, {
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify(products));
}

// Registrar o actualizar un producto
function createProduct(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        try {
            const newProduct = JSON.parse(body);
            const products = getProducts();

            const existingIndex = products.findIndex(
                product => product.barcode === newProduct.barcode
            );

            if (existingIndex >= 0) {
                products[existingIndex] = newProduct;
            } else {
                products.unshift(newProduct);
            }

            saveProducts(products);

            console.log(
                `[BACKEND] Producto guardado: ${newProduct.name} ($${newProduct.price})`
            );

            res.writeHead(201, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                ok: true,
                producto: newProduct
            }));

        } catch (error) {
            res.writeHead(400, {
                'Content-Type': 'application/json'
            });

            res.end(JSON.stringify({
                error: 'JSON inválido'
            }));
        }
    });
}

module.exports = {
    getAllProducts,
    createProduct
};
