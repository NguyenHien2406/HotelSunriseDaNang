const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, walletController.getWalletInfo);
router.post('/topup', verifyToken, walletController.topupWallet);
router.post('/pay-booking', verifyToken, walletController.payBookingWithWallet);

module.exports = router;