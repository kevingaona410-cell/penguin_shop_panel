const router = require('express').Router();

const authController = require('../controllers/AuthController');
const { validateLogin } = require('../middlewares/validateAuth');

// Mostrar formulario de login
router.get('/login', authController.showLogin);

// Autenticar administrador
router.post(
    '/login',
    validateLogin,
    authController.login
);

// Cerrar sesión
router.post('/logout', authController.logout);

module.exports = router;