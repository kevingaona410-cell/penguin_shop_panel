require('dotenv').config();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const connectDB = require('../src/config/database');
const Admin = require('../src/models/Admin');

async function createAdmin() {
    try {
        await connectDB();

        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password) {
            throw new Error(
                'ADMIN_USERNAME y ADMIN_PASSWORD deben estar definidos en el archivo .env'
            );
        }

        const existingAdmin = await Admin.findOne({ username });

        if (existingAdmin) {
            console.log(`El administrador "${username}" ya existe.`);
            return;
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await Admin.create({
            username,
            passwordHash
        });

        console.log(`Administrador "${username}" creado correctamente.`);
    } catch (error) {
        console.error('Error creando administrador:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
}

createAdmin();