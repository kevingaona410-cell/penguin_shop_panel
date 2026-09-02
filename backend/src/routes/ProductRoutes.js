const router = require('express').Router();

const ProductController = require('../controllers/ProductController');

// Formulario de creación de producto
router.get('/admin/products/new', ProductController.showCreateForm);

// Listado y creacion de productos
router.route('/admin/products')
    .get(ProductController.listProducts)
    .post(ProductController.createProduct);

// Formulario de edición de producto
router.get('/admin/products/:id/edit', ProductController.showEditForm);

// Detalles, actualización y eliminación de producto
router.route('/admin/products/:id')
    .get(ProductController.showProduct)
    .put(ProductController.updateProduct)
    .delete(ProductController.deleteProduct);

module.exports = router;