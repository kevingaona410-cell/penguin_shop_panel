const { body, validationResult } = require('express-validator');

const validateLogin = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('El usuario es obligatorio')
        .isLength({ min: 3, max: 50 })
        .withMessage('El usuario debe tener entre 3 y 50 caracteres'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),

    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('auth/login', {
                title: 'Iniciar sesión',
                error: errors.array()[0].msg,
                username: req.body.username
            });
        }

        next();
    }
];

module.exports = {
    validateLogin
};