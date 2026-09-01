// Instalacion de dependencias
const express = require('express');


const app = express();
const PORT = 3000;

// Configuración de middleware
app.use(express.json());
app.use("/", (req, res) => {
    res.send("Hello, Penguin panel shop!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

