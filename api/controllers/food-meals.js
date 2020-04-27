const Meal = require('../models/food-meal')
const mongoose = require('mongoose')

exports.meals_get_all = (req, res, next) => {
	Meal.find({ userId: req.userData.userId })
		.select('_id userId breakfast lunch dinner date')
		.sort('-date')
		.exec()
		.then(meals => {
			const response = {
				count: meals.length,
				meals: meals
			}
			console.log(meals)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.meal_create = (req, res, next) => {
	const meal = new Meal({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		breakfast: req.body.breakfast,
		lunch: req.body.lunch,
		dinner: req.body.dinner,
		date: req.body.date
	})
	meal
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Meal created',
				createdMeal: {
					_id: result._id,
					userId: req.userData.userId,
					breakfast: result.breakfast,
					lunch: result.lunch,
					dinner: result.dinner,
					date: result.date
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

exports.meal_get = (req, res, next) => {
	const id = req.params.mealId
	Meal.findOne({ _id: id, userId: req.userData.userId })
		.select('_id userId userId breakfast lunch dinner date')
		.exec()
		.then(meal => {
			console.log(meal)
			if (meal) {
				res.status(200).json(meal)
			} else {
				res.status(404).json({
					message: 'No meal with that ID'
				})
			}
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId' || err.name == 'CastError') {
				return res.status(404).json({
					message: 'No meal with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.meal_update = (req, res, next) => {
	const id = req.params.mealId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Meal.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Meal updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.meal_delete = (req, res, next) => {
	const id = req.params.mealId
	Meal.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Meal.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Meal deleted'
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
