const express = require('express');
const {
  getRegistrationOptions,
  verifyRegistration,
  getLoginOptions,
  verifyLogin,
  listPasskeys,
  renamePasskey,
  deletePasskey,
} = require('../controllers/passkeyController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Passwordless login ceremony — public, no JWT required.
router.post('/login/options', getLoginOptions);
router.post('/login/verify', verifyLogin);

// Registration + management — require an authenticated session.
router.post('/register/options', authenticate, getRegistrationOptions);
router.post('/register/verify', authenticate, verifyRegistration);
router.get('/', authenticate, listPasskeys);
router.patch('/:id', authenticate, renamePasskey);
router.delete('/:id', authenticate, deletePasskey);

module.exports = router;
