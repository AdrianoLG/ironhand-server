const express = require('express')
const multer = require('multer')

const router = express.Router()
const checkAuth = require('../middleware/check-auth')

const ProductController = require('../controllers/food-product')

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

router.get('/', checkAuth, ProductController.products_get_all)
router.post('/', upload.single('img'), ProductController.product_create)
router.get('/:productId', ProductController.product_get)
router.patch('/:productId', ProductController.product_update)
router.delete('/:productId', ProductController.product_delete)

module.exports = router
