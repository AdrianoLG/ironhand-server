const JGPlant = require('../models/jgPlant')
const mongoose = require('mongoose')

exports.jgPlants_get_all = (req, res, next) => {
	JGPlant.find({ userId: req.userData.userId })
		.select('_id seedId name container coords gallery')
		.exec()
		.then(jgPlants => {
			const response = {
				count: jgPlants.length,
				plants: jgPlants
			}
			console.log(jgPlants)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.jgPlant_create = (req, res, next) => {
	const jgPlant = new JGPlant({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		seedId: req.body.seedId,
		name: req.body.name,
		container: req.body.container,
		coords: req.body.coords,
		gallery: req.body.gallery
	})
	jgPlant
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'JG plant created',
				createdJGPlant: {
					_id: result._id,
					seedId: result.seedId,
					name: result.name,
					container: result.container,
					coords: result.coords,
					gallery: result.gallery
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

exports.jgPlant_get = (req, res, next) => {
	const id = req.params.jgPlantId
	JGPlant.findOne({ _id: id, userId: req.userData.userId })
		.select('_id seedId name container coords gallery')
		.exec()
		.then(jgPlant => {
			console.log(jgPlant)
			res.status(200).json(jgPlant)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId') {
				return res.status(404).json({
					message: 'No JG plant with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.jgPlant_update = (req, res, next) => {
	const id = req.params.jgPlantId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	JGPlant.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'JG plant updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.jgPlant_delete = (req, res, next) => {
	const id = req.params.jgPlantId
	JGPlant.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			JGPlant.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'JG plant deleted'
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
