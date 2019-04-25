const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const WateringsController = require('../controllers/waterings')

router.get('/', checkAuth, WateringsController.waterings_get_all)
router.post('/', checkAuth, WateringsController.watering_create)
router.get('/:wateringId', checkAuth, WateringsController.watering_get)
router.patch('/:wateringId', checkAuth, WateringsController.watering_update)
router.delete('/:wateringId', checkAuth, WateringsController.watering_delete)

module.exports = router
