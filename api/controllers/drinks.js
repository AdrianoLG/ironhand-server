const Drink = require('../models/drink')
const mongoose = require('mongoose')

exports.drinks_get_all = (req, res, next) => {
	Drink.find({ userId: req.userData.userId })
		.select('_id name brand category alcohol graduation img qty unit productQty')
		.exec()
		.then(drinks => {
			const response = {
				count: drinks.length,
				drinks: drinks
			}
			console.log(drinks)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.drink_create = (req, res, next) => {
	const drink = new Drink({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		name: req.body.name,
		brand: req.body.brand,
		category: req.body.category,
		alcohol: req.body.alcohol,
		graduation: req.body.graduation,
		img: req.body.img,
		qty: req.body.qty,
		unit: req.body.unit,
		productQty: req.body.productQty
	})
	drink
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Drink created',
				createdDrink: {
					_id: result._id,
					name: result.name,
					brand: result.brand,
					category: result.category,
					alcohol: result.alcohol,
					graduation: result.graduation,
					img: result.img,
					qty: result.qty,
					unit: result.unit,
					productQty: result.productQty
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

exports.drink_get = (req, res, next) => {
	const id = req.params.drinkId
	Drink.findOne({ _id: id, userId: req.userData.userId })
		.select('_id name brand category alcohol graduation img qty unit productQty')
		.exec()
		.then(drink => {
			console.log(drink)
			res.status(200).json(drink)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId' || err.name == 'CastError') {
				return res.status(404).json({
					message: 'No drink with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.drink_update = (req, res, next) => {
	const id = req.params.drinkId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Drink.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Drink updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.drink_delete = (req, res, next) => {
	const id = req.params.drinkId
	Drink.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Drink.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Drink deleted'
					})
				})
				.catch(err => {
					console.log(err)
					res.status(500).json({
						error: err
					})
				})
		})
		.catch()
}
