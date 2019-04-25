const Watering = require('../models/watering')
const mongoose = require('mongoose')

exports.waterings_get_all = (req, res, next) => {
	Watering.find({ userId: req.userData.userId })
		.select('_id container date fertilizer')
		.exec()
		.then(waterings => {
			const response = {
				count: waterings.length,
				waterings: waterings
			}
			console.log(waterings)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.watering_create = (req, res, next) => {
	const watering = new Watering({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		container: req.body.container,
		date: req.body.date,
		fertilizer: req.body.fertilizer
	})
	watering
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Watering created',
				createdWatering: {
					_id: result._id,
					container: result.container,
					date: result.date,
					fertilizer: result.fertilizer
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

exports.watering_get = (req, res, next) => {
	const id = req.params.wateringId
	Watering.findOne({ _id: id, userId: req.userData.userId })
		.select('_id container date fertilizer')
		.exec()
		.then(watering => {
			console.log(watering)
			res.status(200).json(watering)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No watering with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.watering_update = (req, res, next) => {
	const id = req.params.wateringId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Watering.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Watering updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.watering_delete = (req, res, next) => {
	const id = req.params.wateringId
	Watering.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Watering.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Watering deleted'
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
