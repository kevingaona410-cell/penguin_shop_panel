const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'El usuario es obligatorio'],
            unique: true,
            trim: true,
            minlength: [3, 'El usuario debe tener al menos 3 caracteres'],
            maxlength: [50, 'El usuario no puede superar 50 caracteres']
        },

        passwordHash: {
            type: String,
            required: [true, 'La contraseña es obligatoria']
        }
    },
    {
        timestamps: true
    }
);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;