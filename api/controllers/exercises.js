const Exercise = require('../models/exercise')
const mongoose = require('mongoose')

exports.exercises_get_all = (req, res, next) => {
	Exercise.find({ userId: req.userData.userId })
		.select('_id name category bodyParts')
		.exec()
		.then(exercises => {
			const response = {
				count: exercises.length,
				exercises: exercises
			}
			console.log(exercises)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.exercise_create = (req, res, next) => {
	const exercise = new Exercise({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		name: req.body.name,
		category: req.body.category,
		bodyParts: req.body.bodyParts
	})
	exercise
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Exercise created',
				createdExercise: {
					_id: result._id,
					name: result.name,
					category: result.category,
					bodyParts: result.bodyParts
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

exports.exercise_get = (req, res, next) => {
	const id = req.params.exerciseId
	Exercise.findOne({ _id: id, userId: req.userData.userId })
		.select('_id name category bodyParts')
		.exec()
		.then(exercise => {
			console.log(exercise)
			res.status(200).json(exercise)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId' || err.name == 'CastError') {
				return res.status(404).json({
					message: 'No exercise with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.exercise_update = (req, res, next) => {
	const id = req.params.exerciseId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Exercise.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Exercise updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.exercise_delete = (req, res, next) => {
	const id = req.params.exerciseId
	Exercise.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Exercise.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Exercise deleted'
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
