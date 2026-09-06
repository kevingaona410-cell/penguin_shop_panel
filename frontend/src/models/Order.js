const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'El producto es obligatorio']
        },

        productName: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio'],
            trim: true
        },

        unitPrice: {
            type: Number,
            required: [true, 'El precio unitario es obligatorio'],
            min: [0, 'El precio unitario no puede ser negativo']
        },

        quantity: {
            type: Number,
            required: [true, 'La cantidad es obligatoria'],
            min: [1, 'La cantidad mínima es 1'],
            validate: {
                validator: Number.isInteger,
                message: 'La cantidad debe ser un número entero'
            }
        },

        subtotal: {
            type: Number,
            required: [true, 'El subtotal es obligatorio'],
            min: [0, 'El subtotal no puede ser negativo']
        }
    },
    {
        _id: false
    }
);

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: [true, 'El nombre del cliente es obligatorio'],
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
            maxlength: [100, 'El nombre no puede superar 100 caracteres']
        },

        deliveryAddress: {
            type: String,
            required: [true, 'La dirección del iglú es obligatoria'],
            trim: true,
            minlength: [5, 'La dirección debe tener al menos 5 caracteres'],
            maxlength: [250, 'La dirección no puede superar 250 caracteres']
        },

        items: {
            type: [orderItemSchema],
            required: [true, 'El pedido debe contener productos'],
            validate: {
                validator(items) {
                    return Array.isArray(items) && items.length > 0;
                },
                message: 'El pedido debe contener al menos un producto'
            }
        },

        total: {
            type: Number,
            required: [true, 'El total es obligatorio'],
            min: [0, 'El total no puede ser negativo']
        },

        status: {
            type: String,
            enum: {
                values: [
                    'pending',
                    'preparing',
                    'shipped',
                    'delivered',
                    'cancelled'
                ],
                message: 'El estado del pedido no es válido'
            },
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;