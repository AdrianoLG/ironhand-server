const express = require('express')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const DrinksController = require('../controllers/drinks')

router.get('/', checkAuth, DrinksController.drinks_get_all)
router.post('/', checkAuth, DrinksController.drink_create)
router.get('/:drinkId', checkAuth, DrinksController.drink_get)
router.patch('/:drinkId', checkAuth, DrinksController.drink_update)
router.delete('/:drinkId', checkAuth, DrinksController.drink_delete)

module.exports = router
