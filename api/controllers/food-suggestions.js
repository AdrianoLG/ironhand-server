const FoodSuggestion = require('../models/food-suggestion')
const mongoose = require('mongoose')

exports.foodSuggestions_get_all = (req, res, next) => {
	FoodSuggestion.find({ userId: req.userData.userId })
		.select('_id userId name season ingredients')
		.exec()
		.then(foodSuggestions => {
			const response = {
				count: foodSuggestions.length,
				suggestions: foodSuggestions
			}
			console.log(foodSuggestions)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.foodSuggestion_create = (req, res, next) => {
	const foodSuggestion = new FoodSuggestion({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		name: req.body.name,
		season: req.body.season,
		ingredients: req.body.ingredients
	})
	foodSuggestion
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Suggestion created',
				createdSuggestion: {
					_id: result._id,
					userId: req.userData.userId,
					name: result.name,
					season: result.season,
					ingredients: result.ingredients
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

exports.foodSuggestion_get = (req, res, next) => {
	const id = req.params.suggestionId
	FoodSuggestion.findOne({ _id: id, userId: req.userData.userId })
		.select('_id userId name season ingredients')
		.exec()
		.then(foodSuggestion => {
			console.log(foodSuggestion)
			if (foodSuggestion) {
				res.status(200).json(foodSuggestion)
			} else {
				res.status(404).json({
					message: 'No suggestion with that ID'
				})
			}
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No suggestion with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.foodSuggestion_update = (req, res, next) => {
	const id = req.params.suggestionId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	FoodSuggestion.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Suggestion updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.foodSuggestion_delete = (req, res, next) => {
	const id = req.params.suggestionId
	FoodSuggestion.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			FoodSuggestion.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Suggestion deleted'
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
