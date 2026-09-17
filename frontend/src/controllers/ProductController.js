// Conexion con mongoose para la DB
const mongoose = require('mongoose')
const Product = require('../models/Product') // Importacion del modelo de producto
const Comment = require('../models/Comment') // Importacion del modelo de los comentarios

const allowedCategories = ['fish', 'ice', 'clothing', 'accessories'];
const allowedStock = ['out']

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function createNotFound(resource) {
    const error = new Error(`${resource} no encontrado`);
    error.status = 404;
    return error;
}

// Controlador para listar productos del usuario, ruta GET /products
async function listProducts(req, res, next) {
    try {
        const query = typeof req.query.q === 'string' ? req.query.q.trim() : '';
        const rawStock = typeof req.query.stock === 'string' ? req.query.stock.trim() : '';
        const category = allowedCategories.includes(req.query.category)
            ? req.query.category
            : '';
        const stock = allowedStock.includes(rawStock) ? rawStock : '';
        const filter = { isActive: true };

        if (query) {
            const searchPattern = new RegExp(escapeRegex(query), 'i');
            filter.$or = [
                { name: searchPattern },
                { description: searchPattern }
            ];
        }

        if (category) {
            filter.category = category;
        }

        if (stock === 'out') {
            filter.stock = 0
        }

        const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
        const comments = await Comment.find().sort({createdAt: -1}).lean();

        res.render('products/index', {
            title: 'Productos',
            products,
            comments,
            query,
            category,   
            stock
        });
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