# Nota detallada del backend de Hotel Paradise

## 1) DB

- `backend/DB/connection.js`
  - Conexión a MongoDB usando `mongoose`.
  - Usa la variable de entorno `MONGODB_URI`.
  - Muestra mensaje de conexión exitosa o error.

## 2) Modelos (Mongoose)

### `backend/models/User.js`
- Campos principales:
  - `name`, `email`, `password`, `role`, `phone`, `favorites`.
- Validaciones:
  - `email` único y válido.
  - `password` mínimo 8 caracteres.
  - `name` con longitud mínima y máxima.
- Seguridad:
  - `bcryptjs` para hash de contraseñas antes de guardar.
  - Método `comparePassword` para verificar login.
- Timestamps:
  - `createdAt` y `updatedAt` con `timestamps: true`.

### `backend/models/Room.js`
- Campos principales:
  - `title`, `description`, `pricePerNight`, `capacity`, `beds`, `category`, `amenities`, `imageUrl`, `status`, `rating`.
- Validaciones:
  - `pricePerNight` no negativo.
  - `capacity` mínimo 1.
  - `status` entre `available`, `reserved`, `maintenance`.
- Timestamps:
  - `createdAt` y `updatedAt`.

### `backend/models/Reservation.js`
- Campos principales:
  - `user`, `room`, `checkIn`, `checkOut`, `guests`, `totalPrice`, `status`.
- Validaciones:
  - `checkIn` y `checkOut` obligatorios.
  - `guests` mínimo 1.
  - `totalPrice` no negativo.
- Lógica:
  - `checkOut` debe ser posterior a `checkIn`.
- Timestamps:
  - `createdAt` y `updatedAt`.

### `backend/models/Payment.js`
- Campos principales:
  - `reservation`, `user`, `amount`, `method`, `status`, `payerName`, `transactionId`.
- Validaciones:
  - `amount` no negativo.
  - `method` puede ser `card` o `cash`.
  - `status` puede ser `pending` o `paid`.
  - `payerName` obligatorio.
- Timestamps:
  - `createdAt` y `updatedAt`.

### `backend/models/Promotion.js`
- Campos principales:
  - `title`, `description`, `discountPercent`, `startDate`, `endDate`, `active`.
- Validaciones:
  - `discountPercent` entre 1 y 100.
  - fechas obligatorias.
- Timestamps:
  - `createdAt` y `updatedAt`.

### `backend/models/Carousel.js`
- Campos principales:
  - `title`, `subtitle`, `imageUrl`, `order`, `active`.
- Validaciones:
  - `title` obligatorio.
  - `imageUrl` obligatorio.
- Timestamps:
  - `createdAt` y `updatedAt`.

## 3) Controladores

### `backend/controllers/authController.js`
- Registro de usuario.
- Login de usuario.
- Generación de JWT.
- Endpoint para obtener el usuario actual con token.

### `backend/controllers/userController.js`
- Obtener perfil del usuario logueado.
- Editar perfil de usuario.
- Agregar/quitar favoritos.
- Admin CRUD:
  - listar usuarios.
  - obtener usuario por ID.
  - actualizar usuario por ID.
  - borrar usuario.
- Habilitar admin a usuario.

### `backend/controllers/roomController.js`
- Crear habitación.
- Obtener todas las habitaciones.
- Obtener habitación por ID.
- Actualizar habitación.
- Eliminar habitación.

### `backend/controllers/reservationController.js`
- Crear reserva.
- Validar disponibilidad por fechas.
- Cancelar reserva.
- Obtener reservas del usuario.
- Obtener todas las reservas para admin.
- Cambiar estado de reserva.

### `backend/controllers/paymentController.js`
- Crear pago asociado a reserva.
- Si pago `paid`, cambia la reserva a confirmada.
- Obtener pagos del usuario.
- Obtener pagos globales para admin.
- Actualizar estado de pago.

### `backend/controllers/promotionController.js`
- Crear promoción.
- Obtener promociones activas.
- Obtener todas las promociones para admin.
- Actualizar promoción.
- Activar/desactivar promoción.

### `backend/controllers/carouselController.js`
- Agregar elemento al carrusel.
- Obtener elementos del carrusel activos.
- Obtener todos los elementos para admin.
- Editar elemento.
- Eliminar elemento.

### `backend/controllers/dashboardController.js`
- Generar estadísticas del dashboard.
- Calcular ingresos del mes.
- Calcular reservas del mes.
- Calcular ocupación actual.
- Calcular rating promedio.
- Traer habitaciones más populares.
- Traer reservas recientes.

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
- `GET /api/reservations/me`
- `POST /api/reservations`
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
- `protect`: valida token JWT en `Authorization: Bearer <token>`.
- `adminOnly`: permite solo a usuarios con rol `admin`.

### `backend/middleware/validateRequest.js`
- Valida los errores de `express-validator`.
- Devuelve errores en formato JSON con `success: false`.

## 6) Otros archivos importantes

- `backend/server.js`
  - Configura Express.
  - Carga `cors`, `express.json()` y rutas.
  - Agrega middleware global de errores.

- `backend/.env`
  - Variables:
    - `MONGODB_URI`
    - `JWT_SECRET`
    - `PORT`

- `backend/.gitignore`
  - Ignora `node_modules`, `.env`, etc.

- `backend/package.json`
  - Dependencias del backend.

## 7) Flujo general de uso

1. Usuario se registra en `/api/auth/register`.
2. Usuario inicia sesión en `/api/auth/login` y recibe JWT.
3. Frontend usa JWT para acceder a rutas protegidas.
4. Usuario puede crear reservas, ver perfil, marcar favoritos y pagar.
5. Admin puede: gestionar usuarios, habitaciones, reservas, pagos, promociones y carrusel.
6. Dashboard admin consume estadísticas del backend.

---

### Resumen rápido para Trello

- `DB`: Conexión Mongo
- `Modelos`: User, Room, Reservation, Payment, Promotion, Carousel
- `Controladores`: Auth, User, Room, Reservation, Payment, Promotion, Carousel, Dashboard
- `Rutas`: Auth, User, Room, Reservation, Payment, Promotion, Carousel, Dashboard
- `Middleware`: Auth, ValidateRequest
- `Otros`: server.js, .env, .gitignore, package.json
