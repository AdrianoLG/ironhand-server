const Recipee = require('../models/recipee')
const mongoose = require('mongoose')

exports.recipees_get_all = (req, res, next) => {
	Recipee.find({ userId: req.userData.userId })
		.select('_id name img ingredients instructions')
		.exec()
		.then(recipees => {
			const response = {
				count: recipees.length,
				recipees: recipees
			}
			console.log(recipees)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.recipee_create = (req, res, next) => {
	const recipee = new Recipee({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		name: req.body.name,
		img: req.body.img,
		ingredients: req.body.ingredients,
		instructions: req.body.instructions
	})
	recipee
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Recipee created',
				createdRecipee: {
					_id: result._id,
					name: result.name,
					img: result.img,
					ingredients: result.ingredients,
					instructions: result.instructions
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

exports.recipee_get = (req, res, next) => {
	const id = req.params.recipeeId
	Recipee.findOne({ _id: id, userId: req.userData.userId })
		.select('_id name img ingredients instructions')
		.exec()
		.then(recipee => {
			console.log(recipee)
			res.status(200).json(recipee)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No recipee with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.recipee_update = (req, res, next) => {
	const id = req.params.recipeeId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Recipee.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Recipee updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.recipee_delete = (req, res, next) => {
	const id = req.params.recipeeId
	Recipee.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Recipee.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Recipee deleted'
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
