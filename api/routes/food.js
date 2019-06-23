const express = require('express')
const multer = require('multer')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const ProductController = require('../controllers/food-product')
const MealsController = require('../controllers/food-meals')
const SuggestionsController = require('../controllers/food-suggestions')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/food-products/')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
})
const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true)
	} else {
		cb(null, false)
	}
}
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 3 // 3Mb
	},
	fileFilter: fileFilter
})

router.get('/products', checkAuth, ProductController.products_get_all)
router.post('/products', checkAuth, upload.single('img'), ProductController.product_create)
router.get('/products/:productId', checkAuth, ProductController.product_get)
router.patch('/products/:productId', checkAuth, ProductController.product_update)
router.delete('/products/:productId', checkAuth, ProductController.product_delete)
router.get('/meals', checkAuth, MealsController.meals_get_all)
router.post('/meals', checkAuth, MealsController.meal_create)
router.get('/meals/:mealId', checkAuth, MealsController.meal_get)
router.patch('/meals/:mealId', checkAuth, MealsController.meal_update)
router.delete('/meals/:mealId', checkAuth, MealsController.meal_delete)
router.get('/suggestions', checkAuth, SuggestionsController.foodSuggestions_get_all)
router.post('/suggestions', checkAuth, SuggestionsController.foodSuggestion_create)
router.get('/suggestions/:suggestionId', checkAuth, SuggestionsController.foodSuggestion_get)
router.patch('/suggestions/:suggestionId', checkAuth, SuggestionsController.foodSuggestion_update)
router.delete('/suggestions/:suggestionId', checkAuth, SuggestionsController.foodSuggestion_delete)

module.exports = router
