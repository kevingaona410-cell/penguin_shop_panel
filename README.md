# Penguin Shop Panel

Tienda online server-side para el Challenge de The Hatch. El proyecto contiene
un panel de administración para Paula y una tienda pública para los clientes.

La aplicación está construida con Node.js, Express, MongoDB, Mongoose y Pug.
La tienda no utiliza JavaScript ejecutable en el navegador: las búsquedas,
los filtros y las operaciones del carrito se realizan mediante formularios
HTML, rutas HTTP, sesiones y renderizado server-side.

## Requisitos del Challenge

### Panel de administración

- Login exclusivo para el administrador.
- Contraseñas almacenadas mediante hash con `bcrypt`.
- Sesiones almacenadas en MongoDB con cookies `httpOnly`.
- CRUD completo de productos: crear, consultar, editar y eliminar.
- Activación y desactivación de productos.
- Gestión de precio, stock, categoría, descripción e imagen por URL.
- Visualización de pedidos y de su detalle.
- Actualización del estado de los pedidos.
- Renderizado server-side con Pug.
- Protección de rutas administrativas mediante autenticación y CSRF.

### Tienda online

- Catálogo de productos activos.
- Búsqueda y filtrado por categoría mediante `GET` y renderizado server-side.
- Carrito basado en sesiones.
- Agregar, modificar y eliminar productos mediante formularios HTML.
- Validación de cantidades y stock en el servidor.
- Checkout con nombre y dirección de entrega.
- Creación y confirmación de pedidos.
- Consulta de pedidos y cancelación cuando el estado lo permite.
- Renderizado server-side con Pug.
- Sin React, Vue, AJAX, `fetch`, Axios ni JavaScript frontend.

## Estructura

```text
backend/    Panel de administración
frontend/   Tienda online
docs/       Descripción del Challenge
```

Cada aplicación tiene su propio `package.json`, configuración de MongoDB,
vistas Pug, controladores, modelos y rutas.

## Requisitos previos

- Node.js 18 o superior.
- npm.
- MongoDB local ejecutándose, o una URI de MongoDB accesible.

## Instalación

Desde la raíz del repositorio:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Configuración del entorno

### Backend

Copia `backend/.env.example` como `backend/.env` y completa las variables:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/penguin_shop
SESSION_SECRET=crea-una-clave-larga-y-aleatoria
ADMIN_USERNAME=paula
ADMIN_PASSWORD=define-una-contraseña-segura
NODE_ENV=development
```

`ADMIN_USERNAME` y `ADMIN_PASSWORD` se utilizan únicamente para crear el
primer administrador mediante el script incluido.

### Frontend

Copia `frontend/.env.example` como `frontend/.env`:

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/penguin_shop
SESSION_SECRET=crea-otra-clave-larga-y-aleatoria
NODE_ENV=development
```

El backend y el frontend pueden utilizar la misma base de datos porque
comparten productos y pedidos. Se recomienda usar secretos de sesión
distintos para cada servidor.

No subas los archivos `.env` al repositorio. Ya están incluidos en
`.gitignore`.

## Crear el administrador

Con MongoDB ejecutándose y las variables `ADMIN_USERNAME` y
`ADMIN_PASSWORD` definidas en `backend/.env`:

```bash
cd backend
node scripts/CreateAdmin.js
```

El script guarda únicamente el hash de la contraseña. Si el usuario ya existe,
no crea un duplicado.

## Ejecutar las aplicaciones

Abre dos terminales desde la raíz del proyecto.

### Panel de administración

```bash
cd backend
npm start
```

Panel: <http://localhost:3000>

También puedes utilizar Nodemon durante el desarrollo:

```bash
npm run dev
```

### Tienda online

```bash
cd frontend
npm start
```

Tienda: <http://localhost:3001>

Para desarrollo con Nodemon:

```bash
npm run dev
```

## Flujo de uso

1. Inicia MongoDB.
2. Configura los dos archivos `.env`.
3. Ejecuta `node scripts/CreateAdmin.js` dentro de `backend`.
4. Inicia el backend y accede a `http://localhost:3000/login`.
5. Crea productos desde el panel administrativo.
6. Inicia el frontend y visita `http://localhost:3001/products`.
7. Añade productos al carrito, modifica cantidades y completa el checkout.
8. Revisa el pedido desde la sección de pedidos de la tienda.
9. Gestiona el estado del pedido desde el panel administrativo.

## Rutas principales

### Backend

| Método | Ruta | Función |
| --- | --- | --- |
| `GET` | `/login` | Formulario de acceso |
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
| `GET` | `/products` | Catálogo, búsqueda y filtros |
| `GET` | `/products/:id` | Detalle de producto |
| `POST` | `/cart/add/:id` | Agregar al carrito |
| `PUT` | `/cart/update/:id` | Actualizar cantidad |
| `DELETE` | `/cart/remove/:id` | Eliminar del carrito |
| `DELETE` | `/cart/clear` | Vaciar carrito |
| `GET` | `/orders/checkout` | Mostrar checkout |
| `POST` | `/orders` | Crear pedido |
| `GET` | `/orders` | Listar pedidos |
| `GET` | `/orders/:id` | Ver detalle del pedido |
| `PATCH` | `/orders/:id/cancel` | Cancelar pedido |

Los formularios HTML utilizan `method-override` para enviar métodos `PUT`,
`PATCH` y `DELETE`, ya que los formularios HTML nativos solo soportan `GET` y
`POST`.

## Seguridad y validaciones

- Las contraseñas nunca se guardan en texto plano.
- Las sesiones utilizan cookies `httpOnly` y almacenamiento MongoDB.
- Las rutas del panel requieren autenticación.
- Las operaciones administrativas verifican tokens CSRF.
- Los identificadores MongoDB se validan antes de consultar recursos.
- Los productos, cantidades, estados y stock se validan en el servidor.
- El frontend no confía en validaciones del navegador para crear pedidos.

## Estado de pruebas

Los paquetes incluyen dependencias para pruebas con `supertest` y
`mongodb-memory-server`, pero todavía no hay una suite automatizada
implementada. El script `npm test` conserva el placeholder generado por npm.

## Limitaciones conocidas

- Las operaciones mutables de la tienda pública todavía necesitan incorporar
	protección CSRF propia.
- Los pedidos públicos deben asociarse de forma estricta a la sesión que los
	creó para impedir consultar pedidos de otros usuarios.
- Las imágenes se registran mediante URL; la subida de archivos es una mejora
	opcional del Challenge y no está implementada.

## Licencia

ISC, según la configuración actual del proyecto.