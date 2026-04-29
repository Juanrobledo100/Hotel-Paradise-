const express = require('express');
const { body } = require('express-validator');
const roomController = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomById);

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    body('description').notEmpty().withMessage('La descripción es obligatoria'),
    body('pricePerNight').isNumeric().withMessage('El precio debe ser numérico'),
    body('capacity').isInt({ min: 1 }).withMessage('La capacidad debe ser al menos 1'),
  ],
  validateRequest,
  roomController.createRoom
);

router.put('/:id', protect, adminOnly, roomController.updateRoom);
router.delete('/:id', protect, adminOnly, roomController.deleteRoom);

module.exports = router;
