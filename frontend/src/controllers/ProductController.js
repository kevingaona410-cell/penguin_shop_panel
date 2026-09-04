// Conexion con mongoose para la DB
const mongoose = require('mongoose')
const Product = require('../models/Product') // Importacion del modelo de producto

function createNotFound(resource) {
    const error = new Error(`${resource} no encontrado`);
    error.status = 404;
    return error;
}

// Controlador para listar productos del usuario, ruta GET /products
async function listProducts(req, res, next) {
    try {
        const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();

        res.render('products/index', { title: 'Productos', products });
    } catch (error) {
        next(error);
    }
}

// Controlador para mostrar los detalles de un producto, ruta GET /products/:id
async function showProduct(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Producto'));
        }

        const product = await Product.findOne({ _id: req.params.id, isActive: true }).lean();

        if (!product) {
            return next(createNotFound('Producto'));
        }

        res.render('products/show', { title: product.name, product });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listProducts,
    showProduct
};