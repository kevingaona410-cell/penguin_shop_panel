const router = require('express').Router();

const OrderController = require('../controllers/OrderController');

// Listado de órdenes
router.get('/', OrderController.listOrders);

// Detalles de una orden
router.get('/:id', OrderController.showOrder);

// Actualización de estado
router.put('/:id/status', OrderController.updateOrderStatus);

// Cancelación de una orden
router.put('/:id/cancel', OrderController.cancelOrder);

module.exports = router;