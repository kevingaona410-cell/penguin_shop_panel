// moongose para la base de datos
const mongoose = require("mongoose");

// Definición del esquema del producto
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
            maxlength: [100, 'El nombre no puede superar 100 caracteres']
        },

        description: {
            type: String,
            required: [true, 'La descripción es obligatoria'],
            trim: true,
            maxlength: [
                500,
                'La descripción no puede superar 500 caracteres'
            ]
        },

        price: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            min: [0, 'El precio no puede ser negativo']
        },

        stock: {
            type: Number,
            required: [true, 'El stock es obligatorio'],
            min: [0, 'El stock no puede ser negativo'],
            validate: {
                validator: Number.isInteger,
                message: 'El stock debe ser un número entero'
            }
        },

        category: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            enum: {
                values: ['fish', 'ice', 'clothing', 'accessories'],
                message: 'La categoría seleccionada no es válida'
            }
        },

        imageUrl: {
            type: String,
            trim: true,
            default: null
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Creación del modelo del producto
const Product = mongoose.model("Product", productSchema);

module.exports = Product;