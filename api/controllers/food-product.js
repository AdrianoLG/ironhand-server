const Product = require('../models/food-product')
const mongoose = require('mongoose')

exports.products_get_all = (req, res, next) => {
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
}

exports.product_create = (req, res, next) => {
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
}

exports.product_get = (req, res, next) => {
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
}

exports.product_update = (req, res, next) => {
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
}

exports.product_delete = (req, res, next) => {
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
}
