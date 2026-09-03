// Importacion de Bcrypt
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

// Mostrar formulario de login
function showLogin(req, res) {
    res.render('auth/login', {
        title: 'Iniciar sesión',
        error: null
    });
}
// Autenticar administrador
async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        // Buscar administrador
        const admin = await Admin.findOne({
            username: username.trim()
        });

        // No revelar si el usuario existe o no
        if (!admin) {
            return res.status(401).render('auth/login', {
                title: 'Iniciar sesión',
                error: 'Usuario o contraseña incorrectos',
                username
            });
        }

        // Comparar contraseña con el hash almacenado
        const passwordMatches = await bcrypt.compare(
            password,
            admin.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).render('auth/login', {
                title: 'Iniciar sesión',
                error: 'Usuario o contraseña incorrectos',
                username
            });
        }

        // Regenerar la sesión después del login
        req.session.regenerate((error) => {
            if (error) {
                return next(error);
            }

            req.session.adminId = admin._id.toString();
            req.session.username = admin.username;

            req.session.save((error) => {
                if (error) {
                    return next(error);
                }

                res.redirect('/admin');
            });
        });
    } catch (error) {
        next(error);
    }
}

// Cerrar sesión
function logout(req, res, next) {
    req.session.destroy((error) => {
        if (error) {
            return next(error);
        }

        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
}

module.exports = {
    showLogin,
    login,
    logout
};