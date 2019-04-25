const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const RecipeesController = require('../controllers/recipees')

router.get('/', checkAuth, RecipeesController.recipees_get_all)
router.post('/', checkAuth, RecipeesController.recipee_create)
router.get('/:recipeeId', checkAuth, RecipeesController.recipee_get)
router.patch('/:recipeeId', checkAuth, RecipeesController.recipee_update)
router.delete('/:recipeeId', checkAuth, RecipeesController.recipee_delete)

module.exports = router
