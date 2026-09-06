
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const path = require('path');
const express = require('express'); 
const methodOverride = require('method-override'); // Importar el middleware method-override para soportar métodos HTTP como PUT y DELETE
const session = require('express-session') // 
const MongoStore = require('connect-mongo').default //


const { csrfToken, verifyCSRF } = require('./src/middlewares/csrf');
const requireAuth = require('./src/middlewares/RequireAuth');
const connectDB= require('./src/config/database'); // Importar la función para conectarse a la base de datos

const productRoutes = require('./src/routes/ProductRoutes'); 
const orderRoutes = require('./src/routes/OrderRoutes')
const adminRoutes = require('./src/routes/adminRoutes')
const authRoutes = require('./src/routes/AuthRoutes');


const PORT = process.env.PORT || 3000;
const app = express();

// Configuracion de pug
app.set('view engine', 'pug'); // Configurar Pug como motor de plantillas
app.set('views', path.join(__dirname, 'src/views')); // Configurar la carpeta de vistas

app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde la carpeta public

// Lectura de Json y forms HTML
app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({ extended: false })); // Middleware para parsear datos de formularios
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        }),

        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 8
        }
    })
);

app.use((req, res, next) => {
    res.locals.admin = req.session.adminId
        ? {
            id: req.session.adminId,
            username: req.session.username
        }
        : null;

    next();
});

app.use(methodOverride('_method'));

app.use(csrfToken);
app.use(verifyCSRF);

// Ruta raíz
app.get('/', (req, res) => {
    res.redirect('/admin');
});

// Rutas de autenticacion 
app.use('/', authRoutes)

// Rutas Protegidas
app.use('/admin/products', requireAuth, productRoutes); // Usar las rutas de productos
app.use('/admin/orders', requireAuth, orderRoutes); // Usar las rutas de pedidos
app.use('/admin', requireAuth, adminRoutes);


// Funcion para iniciar el servidor y conectarse a la base de datos
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error.stack);
        process.exit(1); // Salir del proceso con un código de error
    }
}

startServer();
