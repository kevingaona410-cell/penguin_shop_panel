// Conexion con mongoose para la DB
const mongoose = require('mongoose');
const Product = require('../models/Product');

// Crea un error 404 para recursos que no existen.
function createNotFound(resource) {
    const error = new Error(`${resource} no encontrado`);
    error.status = 404;
    return error;
}

// Muestra el contenido actual del carrito.
async function showCart(req, res, next) {
    try {
        const cart = req.session.cart ?? {};
        const productIDs = Object.keys(cart);

        // Carrito vacío
        if (productIDs.length === 0) {
            return res.render('cart/index', {
                title: 'Carrito',
                items: [],
                total: 0
            });
        }

        // Obtener únicamente productos activos
        const products = await Product.find({
            _id: { $in: productIDs },
            isActive: true
        }).lean();

        // Detectar productos que ya no están disponibles
        const validProductIds = new Set(
            products.map(product => product._id.toString())
        );

        // Eliminar del carrito productos que ya no existen o están inactivos
        for (const productId of productIDs) {
            if (!validProductIds.has(productId)) {
                delete cart[productId];
            }
        }

        // Actualizar la sesión con el carrito limpio
        req.session.cart = cart;

        const items = products.map(product => {
            const quantity = cart[product._id.toString()];
            const subtotal = product.price * quantity;

            return {
                product,
                quantity,
                subtotal
            };
        });

        const total = items.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        res.render('cart/index', {
            title: 'Carrito',
            items,
            total
        });

    } catch (error) {
        next(error);
    }
}

// Agrega un producto al carrito.
async function addToCart(req, res, next) {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return next(createNotFound('Producto'));
        }

        const product = await Product.findOne({
            _id: id,
            isActive: true
        }).lean();

        if (!product) {
            return next(createNotFound('Producto'));
        }

        if (product.stock <= 0) {
            const error = new Error('Producto sin stock');
            error.status = 400;
            return next(error);
        }

        if (!req.session.cart) {
            req.session.cart = {};
        }

        const currentQuantity = req.session.cart[id] || 0;

        if (currentQuantity + 1 > product.stock) {
            const error = new Error('No hay suficiente stock disponible');
            error.status = 400;
            return next(error);
        }

        req.session.cart[id] = currentQuantity + 1;

        res.redirect('/cart');

    } catch (error) {
        next(error);
    }
}

// Actualiza la cantidad de un producto del carrito.
async function updateCart(req, res, next) {
    try {
        const { id } = req.params;
        const quantity = Number(req.body.quantity);

        if (!mongoose.isValidObjectId(id)) {
            return next(createNotFound('Producto'));
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            const error = new Error('Cantidad inválida');
            error.status = 400;
            return next(error);
        }

        const product = await Product.findOne({
            _id: id,
            isActive: true
        }).lean();

        if (!product) {
            return next(createNotFound('Producto'));
        }

        if (quantity > product.stock) {
            const error = new Error(
                'Cantidad superior al stock disponible'
            );
            error.status = 400;
            return next(error);
        }

        if (!req.session.cart) {
            req.session.cart = {};
        }

        req.session.cart[id] = quantity;

        res.redirect('/cart');

    } catch (error) {
        next(error);
    }
}

// Elimina un producto concreto del carrito.
function removeFromCart(req, res, next) {
    try {
        const { id } = req.params;

        if (!req.session.cart) {
            return res.redirect('/cart');
        }

        delete req.session.cart[id];

        res.redirect('/cart');

    } catch (error) {
        next(error);
    }
}

// Vacía completamente el carrito.
function clearCart(req, res, next) {
    try {
        req.session.cart = {};

        res.redirect('/cart');

    } catch (error) {
        next(error);
    }
}

module.exports = {
    showCart,
    addToCart,
    updateCart,
    removeFromCart,
    clearCart
};