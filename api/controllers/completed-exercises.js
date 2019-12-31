const CompletedExercise = require('../models/completed-exercise')
const mongoose = require('mongoose')

exports.completedExercises_get_all = (req, res, next) => {
	CompletedExercise.find({ userId: req.userData.userId })
		.select('_id exerciseId date repetitions time minHeart maxHeart')
		.sort({ date: 'desc', minHeart: 'asc' })
		.exec()
		.then(completedExercises => {
			const response = {
				count: completedExercises.length,
				completedExercises: completedExercises
			}
			console.log(completedExercises)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.completedExercise_create = (req, res, next) => {
	const completedExercise = new CompletedExercise({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		exerciseId: req.body.exerciseId,
		date: req.body.date,
		repetitions: req.body.repetitions,
		time: req.body.time,
		minHeart: req.body.minHeart,
		maxHeart: req.body.maxHeart
	})
	completedExercise
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Completed exercise created',
				createdCompletedExercise: {
					_id: result._id,
					exerciseId: result.exerciseId,
					date: result.date,
					repetitions: result.repetitions,
					time: result.time,
					minHeart: result.minHeart,
					maxHeart: result.maxHeart
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

exports.completedExercise_get = (req, res, next) => {
	const id = req.params.completedExerciseId
	CompletedExercise.findOne({ _id: id, userId: req.userData.userId })
		.select('_id exerciseId date repetitions time minHeart maxHeart')
		.exec()
		.then(completedExercise => {
			console.log(completedExercise)
			res.status(200).json(completedExercise)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No completed exercise with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.completedExercise_update = (req, res, next) => {
	const id = req.params.completedExerciseId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	CompletedExercise.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Completed exercise updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.completedExercise_delete = (req, res, next) => {
	const id = req.params.completedExerciseId
	CompletedExercise.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			CompletedExercise.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Completed exercise deleted'
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
