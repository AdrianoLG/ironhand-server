const Plant = require('../models/plant')
const mongoose = require('mongoose')

exports.plants_get_all = (req, res, next) => {
	Plant.find({ userId: req.userData.userId })
		.select(
			'_id name scientific container zone gallery sun watering wateringFrequency frost soil flowering perishable pests img origin transplant death deathCause'
		)
		.sort({ death: 'asc', name: 'asc' })
		.exec()
		.then(plants => {
			const response = {
				count: plants.length,
				plants: plants
			}
			console.log(plants)
			res.status(200).json(response)
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.plant_create = (req, res, next) => {
	const plant = new Plant({
		_id: new mongoose.Types.ObjectId(),
		userId: req.userData.userId,
		name: req.body.name,
		scientific: req.body.scientific,
		container: req.body.container,
		zone: req.body.zone,
		gallery: req.body.gallery,
		sun: req.body.sun,
		watering: req.body.watering,
		wateringFrequency: req.body.wateringFrequency,
		frost: req.body.frost,
		soil: req.body.soil,
		flowering: req.body.flowering,
		perishable: req.body.perishable,
		pests: req.body.pests,
		img: req.body.img,
		origin: req.body.origin,
		transplant: req.body.transplant,
		death: req.body.death,
		deathCause: req.body.deathCause
	})
	plant
		.save()
		.then(result => {
			console.log(result)
			res.status(201).json({
				message: 'Plant created',
				createdPlant: {
					_id: result._id,
					name: result.name,
					scientific: result.scientific,
					container: result.container,
					zone: result.zone,
					gallery: result.gallery,
					sun: result.sun,
					watering: result.watering,
					wateringFrequency: result.wateringFrequency,
					frost: result.frost,
					soil: result.soil,
					flowering: result.flowering,
					perishable: result.perishable,
					pests: result.pests,
					img: result.img,
					origin: result.origin,
					transplant: result.transplant,
					death: result.death,
					deathCause: result.deathCause
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

exports.plant_get = (req, res, next) => {
	const id = req.params.plantId
	Plant.findOne({ _id: id, userId: req.userData.userId })
		.select(
			'_id name scientific container zone gallery sun watering wateringFrequency frost soil flowering perishable pests img origin transplant death deathCause'
		)
		.exec()
		.then(plant => {
			console.log(plant)
			res.status(200).json(plant)
		})
		.catch(err => {
			console.log(err)
			if (err.kind == 'ObjectId' || err.name == 'CastError') {
				return res.status(404).json({
					message: 'No plant with that ID'
				})
			}
			res.status(500).json({ error: err })
		})
}

exports.plant_update = (req, res, next) => {
	const id = req.params.plantId
	console.log(req.body)
	// Get properties set in the body
	const updateOps = {}

	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	// Update only the properties defined
	Plant.updateOne({ _id: id, userId: req.userData.userId }, { $set: updateOps })
		.exec()
		.then(result => {
			console.log(result)
			res.status(200).json({
				message: 'Plant updated'
			})
		})
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: err
			})
		})
}

exports.plant_delete = (req, res, next) => {
	const id = req.params.plantId
	Plant.findOne({ _id: id, userId: req.userData.userId })
		.exec()
		.then(result => {
			if (!result) {
				return res.status(500).json({
					error: error
				})
			}
			Plant.deleteOne({ _id: id, userId: req.userData.userId })
				.exec()
				.then(result => {
					res.status(200).json({
						message: 'Plant deleted'
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
