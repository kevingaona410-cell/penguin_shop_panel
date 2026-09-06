const router = require('express').Router()

const ProductController = require('../controllers/ProductController')

// Listado de productos
router.get('/', ProductController.listProducts);

// Ver detalles de producto
router.get('/:id', ProductController.showProduct);

module.exports = router;