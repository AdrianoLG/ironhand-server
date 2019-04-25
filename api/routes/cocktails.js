const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const CocktailsController = require('../controllers/cocktails')

router.get('/', checkAuth, CocktailsController.cocktails_get_all)
router.post('/', checkAuth, CocktailsController.cocktail_create)
router.get('/:cocktailId', checkAuth, CocktailsController.cocktail_get)
router.patch('/:cocktailId', checkAuth, CocktailsController.cocktail_update)
router.delete('/:cocktailId', checkAuth, CocktailsController.cocktail_delete)

module.exports = router
