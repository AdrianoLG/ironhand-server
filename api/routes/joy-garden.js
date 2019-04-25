const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const JGSeedsController = require('../controllers/jgSeeds')
const JGPlantController = require('../controllers/jgPlants')

router.get('/seeds/', checkAuth, JGSeedsController.jgSeeds_get_all)
router.post('/seeds/', checkAuth, JGSeedsController.jgSeed_create)
router.get('/seeds/:jgSeedId', checkAuth, JGSeedsController.jgSeed_get)
router.patch('/seeds/:jgSeedId', checkAuth, JGSeedsController.jgSeed_update)
router.delete('/seeds/:jgSeedId', checkAuth, JGSeedsController.jgSeed_delete)
router.get('/plants/', checkAuth, JGPlantController.jgPlants_get_all)
router.post('/plants/', checkAuth, JGPlantController.jgPlant_create)
router.get('/plants/:jgPlantId', checkAuth, JGPlantController.jgPlant_get)
router.patch('/plants/:jgPlantId', checkAuth, JGPlantController.jgPlant_update)
router.delete('/plants/:jgPlantId', checkAuth, JGPlantController.jgPlant_delete)

module.exports = router
