require('dotenv').config();

const express = require('express');
const connectDB= require('./src/config/database');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, Penguin Panel Shop!');
});

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
