const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('reservationId').notEmpty().withMessage('El ID de la reserva es obligatorio'),
    body('amount').isFloat({ min: 0 }).withMessage('El monto debe ser numérico y mayor o igual a 0'),
    body('method').isIn(['card', 'cash']).withMessage('Método de pago inválido'),
    body('status').isIn(['pending', 'paid']).withMessage('Estado de pago inválido'),
    body('payerName').notEmpty().withMessage('El nombre del pagador es obligatorio'),
  ],
  validateRequest,
  paymentController.createPayment
);

router.get('/me', protect, paymentController.getUserPayments);
router.get('/', protect, adminOnly, paymentController.getAllPayments);
router.put('/:id', protect, adminOnly, paymentController.updatePaymentStatus);

module.exports = router;
