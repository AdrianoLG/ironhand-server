const Cocktail = require('../models/cocktail')
const mongoose = require('mongoose')

exports.cocktails_get_all = (req, res, next) => {
	Cocktail.find({ userId: req.userData.userId })
		.select('_id name img ingredients mixture')
		.exec()
		.then(cocktails => {
			const response = {
				count: cocktails.length,
				cocktails: cocktails
			}
			console.log(cocktails)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.cocktail_create = (req, res, next) => {
	const cocktail = new Cocktail({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		name: req.body.name,
		img: req.body.img,
		ingredients: req.body.ingredients,
		mixture: req.body.mixture
	})
	cocktail
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Cocktail created',
				createdCocktail: {
					_id: result._id,
					name: result.name,
					img: result.img,
					ingredients: result.ingredients,
					mixture: result.mixture
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

exports.cocktail_get = (req, res, next) => {
	const id = req.params.cocktailId
	Cocktail.findOne({ _id: id, userId: req.userData.userId })
		.select('_id name img ingredients mixture')
		.exec()
		.then(cocktail => {
			console.log(cocktail)
			res.status(200).json(cocktail)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No cocktail with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.cocktail_update = (req, res, next) => {
	const id = req.params.cocktailId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Cocktail.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Cocktail updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.cocktail_delete = (req, res, next) => {
	const id = req.params.cocktailId
	Cocktail.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Cocktail.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Cocktail deleted'
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
