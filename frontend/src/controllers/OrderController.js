// Importación de Mongoose
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

// funcion que devuelve un error si no se encuentra el elemento
function createNotFound(resource) {
    const error = new Error(`${resource} no encontrado`);
    error.status = 404;
    return error;
}


// Ver todos los pedidos
async function listOrders(req, res, next) {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .lean();

        res.render('orders/index', {
            title: 'Mis pedidos',
            orders
        });
    } catch (error) {
        next(error);
    }
}

// Ver un pedido
async function showOrder(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return next(createNotFound('Pedido'));
        }

        const order = await Order.findById(id).lean();

        if (!order) {
            return next(createNotFound('Pedido'));
        }

        res.render('orders/show', {
            title: 'Pedido',
            order
        });
    } catch (error) {
        next(error);
    }
}

// Crear un pedido a partir del carrito
async function createOrder(req, res, next) {
    try {
        const { customerName, deliveryAddress } = req.body;

        if (!customerName || !customerName.trim()) {
            const error = new Error('El nombre del cliente es obligatorio');
            error.status = 400;
            return next(error);
        }

        if (!deliveryAddress || !deliveryAddress.trim()) {
            const error = new Error('La dirección de entrega es obligatoria');
            error.status = 400;
            return next(error);
        }

        const cart = req.session.cart ?? {};
        const productIDs = Object.keys(cart);

        if (productIDs.length === 0) {
            const error = new Error('El carrito está vacío');
            error.status = 400;
            return next(error);
        }

        const products = await Product.find({
            _id: { $in: productIDs },
            isActive: true
        }).lean();

        if (products.length !== productIDs.length) {
            const error = new Error(
                'Uno o más productos del carrito ya no están disponibles'
            );
            error.status = 400;
            return next(error);
        }

        const items = [];
        let total = 0;

        for (const product of products) {
            const quantity = cart[product._id.toString()];

            if (!Number.isInteger(quantity) || quantity < 1) {
                const error = new Error('Cantidad inválida en el carrito');
                error.status = 400;
                return next(error);
            }

            if (quantity > product.stock) {
                const error = new Error(
                    `No hay suficiente stock para ${product.name}`
                );
                error.status = 400;
                return next(error);
            }

            const subtotal = product.price * quantity;

            items.push({
                product: product._id,
                productName: product.name,
                unitPrice: product.price,
                quantity,
                subtotal
            });

            total += subtotal;
        }

        const order = await Order.create({
            customerName: customerName.trim(),
            deliveryAddress: deliveryAddress.trim(),
            items,
            total,
            status: 'pending'
        });

        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        req.session.cart = {};

        res.redirect(`/orders/${order._id}`);
    } catch (error) {
        next(error);
    }
}

// Cancelar un pedido
async function cancelOrder(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return next(createNotFound('Pedido'));
        }

        const order = await Order.findById(id);

        if (!order) {
            return next(createNotFound('Pedido'));
        }

        const cancellableStatuses = ['pending', 'preparing'];

        if (!cancellableStatuses.includes(order.status)) {
            const error = new Error(
                'El pedido no puede ser cancelado en su estado actual'
            );
            error.status = 400;
            return next(error);
        }

        order.status = 'cancelled';
        await order.save();

        res.redirect(`/orders/${order._id}`);
    } catch (error) {
        next(error);
    }
}

// Mostrar formulario de checkout
async function showCheckout(req, res, next) {
    try {
        const cart = req.session.cart ?? {};
        const productIDs = Object.keys(cart);

        if (productIDs.length === 0) {
            const error = new Error('El carrito está vacío');
            error.status = 400;
            return next(error);
        }

        const products = await Product.find({
            _id: { $in: productIDs },
            isActive: true
        }).lean();

        if (products.length !== productIDs.length) {
            const error = new Error(
                'Uno o más productos del carrito ya no están disponibles'
            );
            error.status = 400;
            return next(error);
        }

        const items = products.map(product => {
            const quantity = cart[product._id.toString()];

            return {
                product,
                quantity,
                subtotal: product.price * quantity
            };
        });

        const total = items.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        res.render('orders/checkout', {
            title: 'Confirmar pedido',
            items,
            total
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listOrders,
    showOrder,
    createOrder,
    cancelOrder,
    showCheckout
};