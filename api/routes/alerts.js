const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const AlertsController = require('../controllers/alerts')

router.get('/', checkAuth, AlertsController.alerts_get_all)

module.exports = router