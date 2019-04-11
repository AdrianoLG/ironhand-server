const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')

const router = express.Router()
const Product = require('../../models/food-product')

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

router.get('/', (req, res, next) => {
	Product.find()
		.select('_id name brand category img qty unit productQty expiry tags')
		.exec()
		.then(prods => {
			const response = {
				count: prods.length,
				products: prods
			}
			console.log(prods)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

router.post('/', upload.single('img'), (req, res, next) => {
	console.log(req.file)
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		brand: req.body.brand,
		category: req.body.category,
		img: req.file.path,
		qty: req.body.qty,
		unit: req.body.unit,
		productQty: req.body.productQty,
		productQty: req.body.productQty,
		expiry: req.body.expiry,
		tags: req.body.tags
	})
	product
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Food product succesfully saved',
				createdProduct: {
					_id: result._id,
					name: result.name,
					brand: result.brand,
					category: result.category,
					img: result.img,
					qty: result.qty,
					unit: result.unit,
					productQty: result.productQty,
					expiry: result.expiry,
					tags: result.tags
				}
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId
	Product.findById(id)
		.select('_id name brand category img qty unit productQty expiry tags')
		.exec()
		.then(prod => {
			console.log(prod)
			if (prod) {
				res.status(200).json(prod)
			} else {
				res.status(404).json({
					message: 'No product with that ID'
				})
			}
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({ error: err })
		})
})

router.patch('/:productId', (req, res, next) => {
	const id = req.params.productId
	// Get properties set in the body
	const updateOps = {}
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Product.updateOne({ _id: id }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Product updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId
	Product.deleteOne({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Product ' + id + ' succesfully deleted'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
})

module.exports = router
