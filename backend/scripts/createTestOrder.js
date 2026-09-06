const mongoose = require('mongoose');
const Product = require('../src/models/Product');
const Order = require('../src/models/Order');

const MONGO_URI = 'mongodb://127.0.0.1:27017/penguin_shop';

async function createTestOrder() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log('Conectado a MongoDB');

        const product = await Product.findOne();

        if (!product) {
            throw new Error(
                'No hay productos registrados. Crea al menos un producto antes de crear la orden de prueba.'
            );
        }

        const quantity = 2;
        const subtotal = product.price * quantity;

        const order = await Order.create({
            customerName: 'Cliente de prueba',
            deliveryAddress: 'Iglú de prueba, Penguin Shop',
            items: [
                {
                    product: product._id,
                    productName: product.name,
                    unitPrice: product.price,
                    quantity,
                    subtotal
                }
            ],
            total: subtotal,
            status: 'pending'
        });

        console.log('\nOrden creada correctamente:');
        console.log(`ID: ${order._id}`);
        console.log(`Cliente: ${order.customerName}`);
        console.log(`Producto: ${product.name}`);
        console.log(`Cantidad: ${quantity}`);
        console.log(`Total: ${order.total}`);
        console.log(`Estado: ${order.status}`);
    } catch (error) {
        console.error('Error al crear la orden:', error.message);
    } finally {
        await mongoose.disconnect();
    }
}

createTestOrder();