const Rehearsal = require('../models/rehearsal')
const mongoose = require('mongoose')

exports.rehearsals_get_all = (req, res, next) => {
	Rehearsal.find({ userId: req.userData.userId })
		.select('_id instrument time sheets')
		.exec()
		.then(rehearsals => {
			const response = {
				count: rehearsals.length,
				rehearsals: rehearsals
			}
			console.log(rehearsals)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.rehearsal_create = (req, res, next) => {
	const rehearsal = new Rehearsal({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		instrument: req.body.instrument,
		time: req.body.time,
		sheets: req.body.sheets
	})
	rehearsal
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Rehearsal created',
				createdRehearsal: {
					_id: result._id,
					instrument: result.instrument,
					time: result.time,
					sheets: result.sheets
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

exports.rehearsal_get = (req, res, next) => {
	const id = req.params.rehearsalId
	Rehearsal.findOne({ _id: id, userId: req.userData.userId })
		.select('_id instrument time sheets')
		.exec()
		.then(rehearsal => {
			console.log(rehearsal)
			res.status(200).json(rehearsal)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No rehearsal with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.rehearsal_update = (req, res, next) => {
	const id = req.params.rehearsalId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Rehearsal.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Rehearsal updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.rehearsal_delete = (req, res, next) => {
	const id = req.params.rehearsalId
	Rehearsal.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Rehearsal.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Rehearsal deleted'
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
