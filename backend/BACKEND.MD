# Nota detallada del backend de Hotel Paradise

## 1) DB

- `backend/DB/connection.js`
  - Conecta a MongoDB usando `mongoose`.
  - Usa la variable de entorno `MONGODB_URI`.
  - Maneja conexión exitosa y errores.

## 2) Modelos (Mongoose)

### `backend/models/User.js`
- Campos:
  - `name`, `email`, `password`, `role`, `phone`, `favorites`.
- Validaciones:
  - `email` único y con formato correcto.
  - `password` mínimo 8 caracteres.
  - `name` con longitud mínima y máxima.
- Seguridad:
  - Hash de contraseña con `bcryptjs` antes de guardar.
  - Método `comparePassword` para verificar login.
- Timestamps:
  - `createdAt` y `updatedAt` automáticos.

### `backend/models/Room.js`
- Campos:
  - `title`, `description`, `pricePerNight`, `capacity`, `beds`, `category`, `amenities`, `imageUrl`, `status`, `rating`.
- Validaciones:
  - `pricePerNight` no negativo.
  - `capacity` mínimo 1.
  - `status` debe ser `available`, `reserved` o `maintenance`.
- Timestamps:
  - `createdAt` y `updatedAt` automáticos.

### `backend/models/Reservation.js`
- Campos:
  - `user`, `room`, `checkIn`, `checkOut`, `guests`, `totalPrice`, `status`.
- Validaciones:
  - Fechas obligatorias.
  - `guests` mínimo 1.
  - `totalPrice` no puede ser negativo.
- Lógica:
  - `checkOut` debe ser posterior a `checkIn`.
- Timestamps:
  - `createdAt` y `updatedAt` automáticos.

### `backend/models/Payment.js`
- Campos:
  - `reservation`, `user`, `amount`, `method`, `status`, `payerName`, `transactionId`.
- Validaciones:
  - `amount` no negativo.
  - `method` en `card` o `cash`.
  - `status` en `pending` o `paid`.
  - `payerName` obligatorio.
- Timestamps:
  - `createdAt` y `updatedAt` automáticos.

### `backend/models/Promotion.js`
- Campos:
  - `title`, `description`, `discountPercent`, `startDate`, `endDate`, `active`.
- Validaciones:
  - `discountPercent` entre 1 y 100.
  - `startDate` y `endDate` obligatorios.
- Timestamps:
  - `createdAt` y `updatedAt` automáticos.

### `backend/models/Carousel.js`
- Campos:
  - `title`, `subtitle`, `imageUrl`, `order`, `active`.
- Validaciones:
  - `title` obligatorio.
  - `imageUrl` obligatorio.
- Timestamps:
  - `createdAt` y `updatedAt` automáticos.

## 3) Controladores

### `backend/controllers/authController.js`
- Registro de usuario.
- Login de usuario.
- Generación de JWT.
- Obtener datos del usuario logueado.

### `backend/controllers/userController.js`
- Obtener perfil del usuario logueado.
- Editar perfil de usuario.
- Agregar/quitar favoritos.
- Admin CRUD de usuarios:
  - Listar usuarios.
  - Obtener usuario por ID.
  - Actualizar usuario por ID.
  - Eliminar usuario.
  - Establecer rol admin.

### `backend/controllers/roomController.js`
- Crear habitación.
- Obtener habitaciones.
- Obtener habitación por ID.
- Actualizar habitación.
- Eliminar habitación.

### `backend/controllers/reservationController.js`
- Crear reserva.
- Validar disponibilidad por fecha.
- Cancelar reserva.
- Obtener reservas de usuario.
- Obtener todas las reservas (admin).
- Cambiar estado de reserva.

### `backend/controllers/paymentController.js`
- Crear pago asociado a reserva.
- Simular pago con `cash` o `card`.
- Si el pago es `paid`, actualizar estado de reserva.
- Obtener pagos de usuario.
- Obtener pagos en admin.
- Actualizar estado de pago.

### `backend/controllers/promotionController.js`
- Crear promoción.
- Obtener promociones activas.
- Obtener todas las promociones (admin).
- Actualizar promoción.
- Activar/desactivar promoción.

### `backend/controllers/carouselController.js`
- Crear elemento de carrusel.
- Obtener elementos activos.
- Obtener todos los elementos (admin).
- Editar elemento.
- Eliminar elemento.

### `backend/controllers/dashboardController.js`
- Obtener estadísticas del dashboard.
- Calcular ingresos del mes.
- Calcular reservas del mes.
- Calcular ocupación actual.
- Calcular rating promedio.
- Obtener habitaciones más populares.
- Obtener reservas recientes.

## 4) Rutas

### `backend/routes/authRoutes.js`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### `backend/routes/userRoutes.js`
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/users/favorites`
- `POST /api/users/favorites`
- `DELETE /api/users/favorites/:roomId`
- `GET /api/users` (admin)
- `GET /api/users/:userId` (admin)
- `PUT /api/users/:userId` (admin)
- `PUT /api/users/:userId/admin` (admin)
- `DELETE /api/users/:userId` (admin)

### `backend/routes/roomRoutes.js`
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `POST /api/rooms` (admin)
- `PUT /api/rooms/:id` (admin)
- `DELETE /api/rooms/:id` (admin)

### `backend/routes/reservationRoutes.js`
- `POST /api/reservations`
- `GET /api/reservations/me`
- `GET /api/reservations` (admin)
- `PUT /api/reservations/:id/status` (admin)
- `PUT /api/reservations/:id/cancel`

### `backend/routes/paymentRoutes.js`
- `POST /api/payments`
- `GET /api/payments/me`
- `GET /api/payments` (admin)
- `PUT /api/payments/:id` (admin)

### `backend/routes/promotionRoutes.js`
- `GET /api/promotions`
- `GET /api/promotions/all` (admin)
- `POST /api/promotions` (admin)
- `PUT /api/promotions/:id` (admin)
- `PUT /api/promotions/:id/toggle` (admin)

### `backend/routes/carouselRoutes.js`
- `GET /api/carousel`
- `GET /api/carousel/all` (admin)
- `POST /api/carousel` (admin)
- `PUT /api/carousel/:id` (admin)
- `DELETE /api/carousel/:id` (admin)

### `backend/routes/dashboardRoutes.js`
- `GET /api/dashboard/stats` (admin)
- `GET /api/dashboard/popular-rooms` (admin)
- `GET /api/dashboard/recent-reservations` (admin)

## 5) Middleware

### `backend/middleware/authMiddleware.js`
- `protect`: valida JWT desde `Authorization: Bearer <token>`.
- `adminOnly`: permite solo usuarios admin.

### `backend/middleware/validateRequest.js`
- Revisa errores de `express-validator`.
- Devuelve errores en JSON.

## 6) Otros archivos

- `backend/server.js`
  - Configura Express.
  - Carga `cors`, `express.json()`, rutas y errores.

- `backend/.env`
  - Variables:
    - `MONGODB_URI`
    - `JWT_SECRET`
    - `PORT`

- `backend/.gitignore`
  - Ignora `node_modules`, `.env`, etc.

- `backend/package.json`
  - Dependencias del backend.

## 7) Flujo general

1. Usuario se registra en `/api/auth/register`.
2. Usuario inicia sesión en `/api/auth/login`.
3. Frontend usa JWT para acceder a rutas protegidas.
4. Usuario crea reservas, ve perfil y administra favoritos.
5. Admin gestiona usuarios, habitaciones, reservas, pagos, promociones y carrusel.
6. Dashboard admin consume estadísticas.
