const express = require('express');
const { getHealth, getMetrics } = require('../controllers/healthController');

const router = express.Router();

router.get('/health', getHealth);
router.get('/metrics', getMetrics);

module.exports = router;
