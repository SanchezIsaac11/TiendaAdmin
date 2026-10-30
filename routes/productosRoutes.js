
const {
    getAllProducts,
    createProduct
} = require('../controllers/productosController');

function handleProductRoutes(req, res) {
    if (req.method === 'GET' && req.url === '/api/productos') {
        getAllProducts(req, res);
        return true;
    }

    if (req.method === 'POST' && req.url === '/api/productos') {
        createProduct(req, res);
        return true;
    }

    return false;
}

module.exports = handleProductRoutes;
