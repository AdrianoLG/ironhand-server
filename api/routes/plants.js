const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const PlantsController = require('../controllers/plants')

router.get('/', checkAuth, PlantsController.plants_get_all)
router.post('/', checkAuth, PlantsController.plant_create)
router.get('/:plantId', checkAuth, PlantsController.plant_get)
router.patch('/:plantId', checkAuth, PlantsController.plant_update)
router.delete('/:plantId', checkAuth, PlantsController.plant_delete)

module.exports = router
