const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const verifyToken = require('../middleware/authMiddleware');

// Các route này bắt buộc phải đăng nhập mới được gọi (dùng verifyToken)
router.get('/', verifyToken, bookingController.getUserBookings);
router.post('/', verifyToken, bookingController.createBooking);
router.put('/:id/cancel', verifyToken, bookingController.cancelBooking);

module.exports = router;