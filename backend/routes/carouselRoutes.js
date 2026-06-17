const express = require('express');
const { body } = require('express-validator');
const carouselController = require('../controllers/carouselController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', carouselController.getCarouselItems);
router.get('/all', protect, adminOnly, carouselController.getAllCarouselItems);
router.post(
  '/',
  protect,
  adminOnly,
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('imageUrl').notEmpty().withMessage('La URL de la imagen es obligatoria'),
  ],
  validateRequest,
  carouselController.createCarouselItem
);
router.put('/:id', protect, adminOnly, carouselController.updateCarouselItem);
router.delete('/:id', protect, adminOnly, carouselController.deleteCarouselItem);

module.exports = router;
