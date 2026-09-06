const router = require('express').Router();

const OrderController = require('../controllers/OrderController');

router.get('/', OrderController.listOrders);

router.get('/checkout', OrderController.showCheckout);

router.get('/:id', OrderController.showOrder);

router.post('/', OrderController.createOrder);

router.patch('/:id/cancel', OrderController.cancelOrder);

module.exports = router;