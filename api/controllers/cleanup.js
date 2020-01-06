const CleaningTask = require('../models/cleaning-task')
const mongoose = require('mongoose')

exports.cleaningTasks_get_all = (req, res, next) => {
	CleaningTask.find({ userId: req.userData.userId })
		.select('_id place date tasks')
		.sort({ date: 'desc', place: 'asc' })
		.exec()
		.then(cleaningTasks => {
			const response = {
				count: cleaningTasks.length,
				cleaningTasks: cleaningTasks
			}
			console.log(cleaningTasks)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.cleaningTask_create = (req, res, next) => {
	const cleaningTask = new CleaningTask({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		place: req.body.place,
		date: req.body.date,
		tasks: req.body.tasks
	})
	cleaningTask
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Cleaning task created',
				createdCleaningTask: {
					_id: result._id,
					place: result.place,
					date: result.date,
					tasks: result.tasks
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

exports.cleaningTask_get = (req, res, next) => {
	const id = req.params.cleaningTaskId
	CleaningTask.findOne({ _id: id, userId: req.userData.userId })
		.select('_id place date tasks')
		.exec()
		.then(cleaningTask => {
			console.log(cleaningTask)
			res.status(200).json(cleaningTask)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No cleaning task with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.cleaningTask_update = (req, res, next) => {
	const id = req.params.cleaningTaskId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	CleaningTask.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Cleaning task updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.cleaningTask_delete = (req, res, next) => {
	const id = req.params.cleaningTaskId
	CleaningTask.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			CleaningTask.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Cleaning task deleted'
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
