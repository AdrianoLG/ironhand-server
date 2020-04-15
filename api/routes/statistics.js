const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const StatisticsController = require('../controllers/statistics')

router.get('/', checkAuth, StatisticsController.statistics_get_all)

module.exports = router