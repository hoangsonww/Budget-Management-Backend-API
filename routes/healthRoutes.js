const express = require('express');
const { getHealth, getMetrics, getPing } = require('../controllers/healthController');

const router = express.Router();

router.get('/health', getHealth);
router.get('/metrics', getMetrics);
router.get('/ping', getPing);

module.exports = router;
