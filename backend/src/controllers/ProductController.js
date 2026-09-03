// conexión con moongose para la base de datos
const mongoose = require('mongoose');
const Product = require('../models/Product'); // importación del modelo de producto
const {
    getValidationErrors,
    createNotFound
} = require('../../helpers/errors');

// Controlador para obtener el datos de un producto desde el cuerpo de la solicitud
function getProductData(body) {
    return {
        name: body.name,
        description: body.description,
        price: body.price === '' ? undefined : Number(body.price),
        stock: body.stock === '' ? undefined : Number(body.stock),
        category: body.category,
        imageUrl: body.imageUrl?.trim() || null,
        isActive: body.isActive === 'on'
    };
}

// Controlador para listar productos del admin, ruta GET /admin/products
async function listProducts(req, res, next) {
    try {
        const products = await Product.find().sort({createdAt: -1}).lean();

        res.render('products/index', {title: 'Productos', products});
    } catch (error) {
        next(error);
    }
}

// Controlador para mostrar el formulario de creación de producto, ruta GET /admin/products/new
function showCreateForm(req, res) {
    res.render('products/new', {title: 'Crear Producto', product: {}, errors: []});
}

// Controlador para crear un nuevo producto, ruta POST /admin/products
async function createProduct(req, res, next) {
    try {
        const productData = getProductData(req.body);
        const product = await Product.create(productData);
        res.redirect(`/admin/products/${product._id}`);

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).render('products/new', {
                title: 'Crear Producto',
                product: {
                    ...req.body,
                    isActive: req.body.isActive === 'on'
                },
                errors: getValidationErrors(error)
            });
        }
        next(error);
    }
}

// Controlador para mostrar los detalles de un producto, ruta GET /admin/products/:id 
async function showProduct(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Producto'));
        }

        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return next(createNotFound('Producto'));
        }

        res.render('products/show', {title: product.name, product});
    } catch (error) {
        next(error);
    }
}

// Controlador para mostrar el formulario de edición de un producto, ruta GET /admin/products/:id/edit
async function showEditForm(req, res, next) { 
    try{
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Producto'));
        }
    
        const product = await Product.findById(req.params.id).lean();

        if (!product) {
            return next(createNotFound('Producto'));
        }
        res.render('products/edit', {title: 'Editar Producto', product, errors: []});
    
    } catch (error) {
        next(error);
    }
}

// Controlador para actualizar un producto, ruta PUT /admin/products/:id
async function updateProduct(req, res, next) {
    try { 
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Producto'));
        }
        
        const productData = getProductData(req.body);

        const product = await Product.findByIdAndUpdate(req.params.id, productData, {returnDocument: 'after', runValidators: true});

        if (!product) {
            return next(createNotFound('Producto'));
        }
        res.redirect(`/admin/products/${product._id}`);
    
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).render('products/edit', {
                title: 'Editar Producto',
                product: {
                    ...req.body,
                    _id: req.params.id,
                    isActive: req.body.isActive === 'on'
                },
                errors: getValidationErrors(error)
            });
        }
        next(error);
    }
}

// Controlador para eliminar un producto, ruta DELETE /admin/products/:id
async function deleteProduct(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Producto'));
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return next(createNotFound('Producto'));
        }

        res.redirect('/admin/products');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listProducts,
    showCreateForm,
    createProduct,
    showProduct,
    showEditForm,
    updateProduct,
    deleteProduct
};