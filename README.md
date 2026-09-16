# Penguin Shop Panel

Proyecto final del Challenge de The Hatch. Este repositorio contiene dos aplicaciones separadas:

- `backend/`: panel de administración para Paula
- `frontend/`: tienda online para clientes

La aplicación está construida con Node.js, Express, MongoDB, Mongoose y Pug. La solución sigue una arquitectura server-side, sin uso de JavaScript del lado del cliente para la lógica principal del negocio.

## Descripción del proyecto

La plataforma permite gestionar productos, pedidos y clientes de una manera completa en dos interfaces distintas:

### Backend (administración)

- Login exclusivo para administrador
- Hash de contraseñas con `bcrypt`
- Sesiones con `express-session` y almacenamiento en MongoDB
- CRUD completo de productos
- Activación y desactivación de productos
- Gestión de precio, stock, categoría, descripción e imagen por URL
- Visualización de pedidos y detalle por pedido
- Cambio de estado de pedidos
- Protección de rutas con autenticación y CSRF
- Renderizado con Pug

### Frontend (tienda)

- Catálogo de productos activos
- Búsqueda y filtrado por categoría
- Carrito basado en sesión
- Agregar, actualizar y eliminar productos del carrito
- Validación de stock y cantidades en el servidor
- Checkout con nombre y dirección de entrega
- Confirmación y seguimiento de pedidos
- Consulta de pedidos por sesión
- Cancelación de pedidos según su estado
- Renderizado con Pug
- Sin React, Vue, AJAX, `fetch`, Axios ni JavaScript del navegador

## Estructura del repositorio

```text
backend/    Panel de administración
frontend/   Tienda online
docs/       Documentación del Challenge
README.md   Documentación del proyecto
```

Cada aplicación tiene su propio package.json, modelos, rutas, controladores y vistas.

## Requisitos previos

- Node.js 18 o superior
- npm
- MongoDB ejecutándose localmente o una URI accesible

## Instalación

Desde la raíz del repositorio:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Configuración del entorno

Crea los archivos `.env` dentro de cada proyecto con estas variables.

### Backend (.env)

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/penguin_shop
SESSION_SECRET=una_clave_larga_y_segura
ADMIN_USERNAME=paula
ADMIN_PASSWORD=una_contraseña_segura
NODE_ENV=development
```

`ADMIN_USERNAME` y `ADMIN_PASSWORD` se utilizan para crear el administrador inicial mediante el script incluido.

### Frontend (.env)

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/penguin_shop
SESSION_SECRET=otra_clave_larga_y_segura
NODE_ENV=development
```

Se recomienda usar secretos distintos para backend y frontend.

## Crear el administrador inicial

Con MongoDB en ejecución y el archivo .env configurado, ejecuta:

```bash
cd backend
node scripts/CreateAdmin.js
```

Este script genera el usuario administrador con contraseña hashada. Si ya existe, no crea duplicados.

## Ejecutar las aplicaciones

Abre dos terminales desde la raíz del proyecto.

### 1 Backend

```bash
cd backend
npm start
```

Accede a:

- http://localhost:3000/login

También puedes usar:

```bash
npm run dev
```

### 2 Frontend

```bash
cd frontend
npm start
```

Accede a:

- http://localhost:3001/products

También puedes usar:

```bash
npm run dev
```

## Flujo recomendado de uso

1. Inicia MongoDB.
2. Configura los dos archivos `.env`.
3. Ejecuta `node scripts/CreateAdmin.js` desde backend.
4. Inicia el backend y entra en http://localhost:3000/login.
5. Crea productos desde el panel administrativo.
6. Inicia el frontend y visita la tienda en http://localhost:3001/products.
7. Agrega productos al carrito y completa el checkout.
8. Consulta y revisa el pedido desde la tienda.
9. Gestiona el estado del pedido desde el panel de administración.

## Rutas principales

### Backend

| Método | Ruta | Función |
| --- | --- | --- |
| `GET` | `/login` | Mostrar formulario de login |
| `POST` | `/login` | Iniciar sesión |
| `POST` | `/logout` | Cerrar sesión |
| `GET` | `/admin/products` | Listar productos |
| `POST` | `/admin/products` | Crear producto |
| `PUT` | `/admin/products/:id` | Actualizar producto |
| `DELETE` | `/admin/products/:id` | Eliminar producto |
| `GET` | `/admin/orders` | Listar pedidos |
| `PUT` | `/admin/orders/:id/status` | Cambiar estado |
| `PUT` | `/admin/orders/:id/cancel` | Cancelar pedido |

### Frontend

| Método | Ruta | Función |
| --- | --- | --- |
| `GET` | `/products` | Catálogo y filtros |
| `GET` | `/products/:id` | Detalle del producto |
| `POST` | `/cart/add/:id` | Añadir producto al carrito |
| `PUT` | `/cart/update/:id` | Actualizar cantidad |
| `DELETE` | `/cart/remove/:id` | Eliminar producto del carrito |
| `DELETE` | `/cart/clear` | Vaciar carrito |
| `GET` | `/orders/checkout` | Ver checkout |
| `POST` | `/orders` | Crear pedido |
| `GET` | `/orders` | Ver pedidos del cliente |
| `GET` | `/orders/:id` | Ver detalle del pedido |
| `PATCH` | `/orders/:id/cancel` | Cancelar pedido |

Los formularios utilizan `method-override` para soportar `PUT`, `PATCH` y `DELETE`.

## Seguridad y validaciones

- Las contraseñas no se almacenan en texto plano.
- Las sesiones se guardan en MongoDB con cookies `httpOnly`.
- Las rutas del panel requieren autenticación.
- Las acciones administrativas validan CSRF.
- Los identificadores MongoDB se validan antes de consultar recursos.
- Stock, cantidades y estados se validan en el servidor.
- El frontend no depende de validación en navegador para generar pedidos.

## Estado de pruebas

Los paquetes incluyen dependencias para pruebas con `supertest` y `mongodb-memory-server`, pero aún no hay una suite automatizada implementada. El comando `npm test` conserva el placeholder por defecto de npm.

## Limitaciones conocidas

- La tienda pública puede reforzar la protección CSRF en acciones mutables.
- Las imágenes se guardan como URL; la subida de archivos no está implementada.

## Licencia

ISC

