
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const path = require('path'); // Importar el módulo path para manejar rutas de archivos
const express = require('express'); // Importar el framework Express
const methodOverride = require('method-override'); // Importar el middleware method-override para soportar métodos HTTP como PUT y DELETE

const connectDB= require('./src/config/database'); // Importar la función para conectarse a la base de datos
const productRoutes = require('./src/routes/ProductRoutes'); // Importar las rutas de productos

const PORT = process.env.PORT || 3000;
const app = express();

// Configuracion de pug
app.set('view engine', 'pug'); // Configurar Pug como motor de plantillas
app.set('views', path.join(__dirname, 'src/views')); // Configurar la carpeta de vistas

app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde la carpeta public

// Lectura de Json y forms HTML
app.use(express.json()); // Middleware para parsear JSON
app.use(express.urlencoded({ extended: false })); // Middleware para parsear datos de formularios

// Soporte para métodos HTTP PUT y DELETE en formularios HTML
app.use(methodOverride('_method')); 

// Rutas 
app.get('/', (req,res) => { 
    res.redirect('/admin/products'); // Redirigir la ruta raíz a /admin/products
})

app.use('/', productRoutes); // Usar las rutas de productos

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
