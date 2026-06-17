const express = require('express');
const { body } = require('express-validator');
const reservationController = require('../controllers/reservationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('roomId').notEmpty().withMessage('El ID de la habitación es obligatorio'),
    body('checkIn').isISO8601().withMessage('Fecha de check-in inválida'),
    body('checkOut').isISO8601().withMessage('Fecha de check-out inválida'),
    body('guests').isInt({ min: 1 }).withMessage('El número de huéspedes debe ser al menos 1'),
    body('totalPrice').isFloat({ min: 0 }).withMessage('El precio total debe ser un número válido'),
  ],
  validateRequest,
  reservationController.createReservation
);

router.get('/me', reservationController.getUserReservations);
router.get('/', adminOnly, reservationController.getAllReservations);
router.put('/:id/status', adminOnly, reservationController.updateReservationStatus);
router.put('/:id/cancel', reservationController.cancelReservation);

module.exports = router;
