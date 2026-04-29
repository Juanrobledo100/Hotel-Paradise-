const express = require('express');
const { body } = require('express-validator');
const promotionController = require('../controllers/promotionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', promotionController.getPromotions);
router.get('/all', protect, adminOnly, promotionController.getAllPromotions);
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('discountPercent').isFloat({ min: 1, max: 100 }).withMessage('El descuento debe ser entre 1 y 100'),
    body('startDate').isISO8601().withMessage('Fecha de inicio inválida'),
    body('endDate').isISO8601().withMessage('Fecha de fin inválida'),
  ],
  validateRequest,
  promotionController.createPromotion
);
router.put('/:id', protect, adminOnly, promotionController.updatePromotion);
router.put('/:id/toggle', protect, adminOnly, promotionController.togglePromotion);

module.exports = router;
