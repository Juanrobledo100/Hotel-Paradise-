const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/popular-rooms', dashboardController.getPopularRooms);
router.get('/recent-reservations', dashboardController.getRecentReservations);

module.exports = router;
