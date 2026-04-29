const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(protect);

router.get('/me', userController.getUserProfile);
router.put(
  '/me',
  [body('name').optional().trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')],
  validateRequest,
  userController.updateUserProfile
);

router.get('/favorites', userController.getFavorites);
router.post(
  '/favorites',
  [body('roomId').notEmpty().withMessage('El ID de la habitación es obligatorio')],
  validateRequest,
  userController.addFavorite
);
router.delete('/favorites/:roomId', userController.removeFavorite);

router.get('/', adminOnly, userController.getAllUsers);
router.get('/:userId', adminOnly, userController.getUserById);
router.put(
  '/:userId',
  adminOnly,
  [body('name').optional().trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')],
  validateRequest,
  userController.updateUserById
);
router.put('/:userId/admin', adminOnly, userController.setAdmin);
router.delete('/:userId', adminOnly, userController.deleteUser);

module.exports = router;
