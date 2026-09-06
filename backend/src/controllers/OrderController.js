// Importación de Mongoose
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { createNotFound } = require('../../helpers/errors');

// Controlador para listar todas las órdenes, ruta GET /admin/orders
async function listOrders(req, res, next) {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .lean();

        res.render('orders/index', { title: 'Pedidos', orders });
    } catch (error) {
        next(error);
    }
}

// Controlador para mostrar detalles de una orden, ruta GET /admin/orders/:id
async function showOrder(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Orden'));
        }

        const order = await Order.findById(req.params.id).lean();

        if (!order) {
            return next(createNotFound('Orden'));
        }

        res.render('orders/show', { title: 'Pedido', order });
    } catch (error) {
        next(error);
    }
}

// Controlador para actualizar el estado de una orden,
// ruta PUT /admin/orders/:id/status
async function updateOrderStatus(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Orden'));
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(createNotFound('Orden'));
        }

        const { status } = req.body;

        const allowedTransitions = {
            pending: ['preparing'],
            preparing: ['shipped'],
            shipped: ['delivered'],
            delivered: []
        };

        if (!allowedTransitions[order.status]?.includes(status)) {
            const error = new Error('Transición de estado no válida');
            error.status = 400;
            throw error;
        }

        order.status = status;
        await order.save();

        res.redirect(`/admin/orders/${order._id}`);
    } catch (error) {
        next(error);
    }
}

// Controlador para cancelar una orden,
// ruta PUT /admin/orders/:id/cancel
async function cancelOrder(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Orden'));
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(createNotFound('Orden'));
        }

        const cancellableStatuses = ['pending', 'preparing'];

        if (!cancellableStatuses.includes(order.status)) {
            const error = new Error(
                'La orden no puede ser cancelada en su estado actual'
            );
            error.status = 400;
            throw error;
        }

        order.status = 'cancelled';
        await order.save();

        res.redirect(`/admin/orders/${order._id}`);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listOrders,
    showOrder,
    updateOrderStatus,
    cancelOrder
};