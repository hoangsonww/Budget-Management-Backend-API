const express = require('express');
const { register, login, logout, resetPassword, verifyEmail, verifyToken } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/verify-token', verifyToken);

module.exports = router;
