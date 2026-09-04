require('dotenv').config();

const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const connectDB = require('./src/config/database'); // Importar DB

const cartRoutes = require('./src/routes/CartRoutes')
const productRoutes = require('./src/routes/ProductRoutes')
const orderRoutes = require('./src/routes/OrderRoutes');

const PORT = process.env.PORT || 3001;
const app = express(); 

// Configuración de Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride((req) => {
    if (req.body && typeof req.body._method === 'string') {
        return req.body._method;
    }

    return undefined;
}));

// Configuración de vistas
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
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
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', { title: 'Penguin Shop' });
});

// Rutas 
app.use('/cart', cartRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

async function startServer() {
    try { 
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server', error.stack)
        process.exit(1); // Salir del proceso con un codigo de error
    }
}

startServer();