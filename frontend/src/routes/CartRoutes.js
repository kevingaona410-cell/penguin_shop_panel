const router = require('express').Router();

const CartController = require('../controllers/CartController');

// Ver Carrito
router.get('/', CartController.showCart);

// Agregar Producto
router.post('/add/:id', CartController.addToCart);

// Actualizar carrito
router.put('/update/:id', CartController.updateCart);

// Eliminar producto
router.delete('/remove/:id', CartController.removeFromCart);

// Vaciar Carrito
router.delete('/clear', CartController.clearCart);

module.exports = router;